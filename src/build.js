var path = require('path');
var dag = require('breeze-dag');
var through2 = require('through2');

var relativeImports = /import\s*{[a-zA-Z0-9_\$\,\s]+}\s*from\s*'(\.[^\s']+)';\s*/g;
var nonRelativeImports = /import(\s*{?[a-zA-Z0-9_\$\*\,\s]+}?)?(\s*as\s*[a-zA-Z0-9_\$]+)?(\s*from)?\s*'[a-zA-Z0-9_\-\/]+';\s*/g;
var importGrouper = /import\s*{([a-zA-Z0-9_\$\,\s]+)}\s*from\s*'([a-zA-Z0-9_\-\/]+)'\s*;\s*/;

exports.sortFiles = function sortFiles() {
  var edges = [];
  var files = {};

  function getImports(file) {
    var contents = file.contents;
    var deps = [];
    var match;
    while (match = relativeImports.exec(contents)) {
      deps.push(path.relative(file.base, path.resolve(path.dirname(file.path), match[1] + '.js')));
    }

    return deps;
  }

  function bufferFile(file, enc, callback) {
    var imports = getImports(file);
    if (!imports.length) {
      // include a null dependency so disconnected nodes will be included in the DAG traversal
      imports = [null];
    }

    imports.forEach(function(dependency) {
      edges.push([dependency, file.relative]);
    });

    files[file.relative] = file;
    callback();
  }

  function endStream(callback) {
    var self = this;

    dag(edges, 1, function(filePath, next) {
      self.push(files[filePath]);
      next();
    }, callback);
  }

  return through2.obj(bufferFile, endStream);
};

exports.extractImports = function(content, importsToAdd){
  var matchesToKeep = content.match(nonRelativeImports);

  if(matchesToKeep){
    matchesToKeep.forEach(function(toKeep){ importsToAdd.push(toKeep) });
  }

  content = content.replace(nonRelativeImports, '');
  content = content.replace(relativeImports, '');

  return content;
};

exports.createImportBlock = function(importsToAdd){
  var finalImports = {}, importBlock = '';

  importsToAdd.forEach(function(toAdd){
    var groups = importGrouper.exec(toAdd);
    if(!groups) {
      toAdd = toAdd.trim();
      if(importBlock.indexOf(toAdd) === -1){
        importBlock += toAdd + '\n';
      }

      return;
    };

    var theImports = groups[1].split(',');
    var theSource = groups[2].trim();
    var theList = finalImports[theSource] || (finalImports[theSource] = []);

    theImports.forEach(function(item){
      item = item.trim();
      if(theList.indexOf(item) === -1){
        theList.push(item);
      }
    });
  });

  Object.keys(finalImports).forEach(function(key) {
    importBlock += 'import {' + finalImports[key].join(',') + '} from \'' + key + '\';\n';
  });

  return importBlock + '\n';
};

exports.cleanGeneratedCode = function(code) {
  var classCallCheckMethodMatcher = /function\s+_classCallCheck\(instance,\s+Constructor\)\s+\{\s+if\s+\(!\(instance\s+instanceof\s+Constructor\)\)\s+\{\s+throw\s+new\s+TypeError\("Cannot\s+call\s+a\s+class\s+as\s+a\s+function"\)\;\s+}\s+}/g;
  var classCallCheckInvocationMatcher = /_classCallCheck\(this,\s[_a-zA-z1-9]+\);/g

  return code.replace(classCallCheckMethodMatcher, '').replace(classCallCheckInvocationMatcher, '');
}
