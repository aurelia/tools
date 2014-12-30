var fs = require('fs');
var path = require('path');

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

module.exports = {
  updateOwnDependenciesFromLocalRepositories:function(){
    var dependencyPath = 'jspm_packages/github/aurelia';

    fs.readdirSync(dependencyPath)
      .filter(function(name){ return name.endsWith('.js'); })
      .map(function(name) { 
        return [
          '../' + name.substring(0, name.indexOf('@')) + '/dist/amd',
          dependencyPath + '/' + name.substring(0, name.indexOf('.js')) + '/amd'
        ]; 
      }).forEach(function(value){
        copyDir(value[0], value[1]);
      });
  }
};