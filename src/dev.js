var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var gitPath = 'http://github.com/aurelia/';
var dependencyPath = 'jspm_packages/npm';

if(!('endsWith' in String.prototype)){
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

var mkdir = function(dir) {
  // making directory without exception if exists
  try {
    fs.mkdirSync(dir, 0755);
  } catch(e) {
    if(e.code != "EEXIST") {
      throw e;
    }
  }
};

var copyDir = function(src, dest) {
  try{
    mkdir(dest);
    var files = fs.readdirSync(src);
    for(var i = 0; i < files.length; i++) {
      var current = fs.lstatSync(path.join(src, files[i]));
      if(current.isDirectory()) {
        copyDir(path.join(src, files[i]), path.join(dest, files[i]));
      } else if(current.isSymbolicLink()) {
        var symlink = fs.readlinkSync(path.join(src, files[i]));
        fs.symlinkSync(symlink, path.join(dest, files[i]));
      } else {
        copy(path.join(src, files[i]), path.join(dest, files[i]));
      }
    }
  }catch(error){
    console.log(error);
  }
};

var copy = function(src, dest) {
  var oldFile = fs.createReadStream(src);
  var newFile = fs.createWriteStream(dest);
  oldFile.pipe(newFile);
};

var findAureliaDirectories = function(name) {
  return name.startsWith('aurelia-');
};

var mapAureliaDirectories = function(name) {
  return [
    '../' + name.substring(0, name.indexOf('@')).replace('aurelia-', ''),
    gitPath + name.substring(0, name.indexOf('@')).replace('aurelia-', '') + '.git'
  ];
};

var pullDevEnv = function(value) {
  mkdir(value[0]);
  exec("git clone " + value[1] + " " + value[0]);
};

module.exports = {
  updateOwnDependenciesFromLocalRepositories:function(depth){
    depth = (depth || 0) + 1;
    var levels  = '';

    for (var i = 0; i < depth; ++i) {
      levels += '../';
    }

    fs.readdirSync(dependencyPath)
      .filter(function(name){ return name.startsWith('aurelia-') && name.endsWith('.js'); })
      .map(function(name) {
        return [
          levels + name.substring(0, name.indexOf('@')).replace('aurelia-', '') + '/dist/amd',
          dependencyPath + '/' + name.substring(0, name.indexOf('.js'))
        ];
      }).forEach(function(value){
        if (fs.existsSync(value[0])) {
          copyDir(value[0], value[1]);
        }
      });
  },
  buildDevEnv: function () {
    fs.readdirSync(dependencyPath)
      .filter(findAureliaDirectories)
      .map(mapAureliaDirectories)
      .forEach(function (value) {
        pullDevEnv(value);

        var normalizedPath = path.normalize(value[0]);
        exec("npm install", {
          cwd: normalizedPath
        });
         exec("gulp build", {
          cwd: normalizedPath
        });
      });

    var sys = require('sys');

    function puts(error, stdout, stderr) { sys.puts(stdout) }
  },
  pullDevEnv: function () {
    fs.readdirSync(dependencyPath)
      .filter(findAureliaDirectories)
      .map(mapAureliaDirectories)
      .forEach(pullDevEnv);

    var sys = require('sys');

    function puts(error, stdout, stderr) { sys.puts(stdout) }
  }
};
