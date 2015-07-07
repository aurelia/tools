var relativeImports = /import\s*{[a-zA-Z\,\s]+}\s*from\s*'\.\/[a-zA-Z\-]+';\s*/g;
var nonRelativeImports = /import\s*{?[a-zA-Z\*\,\s]+}?\s*from\s*'[a-zA-Z\-]+';\s*/g;
var importGrouper = /import\s*{([a-zA-Z\,\s]+)}\s*from\s*'([a-zA-Z\-]+)'\s*;\s*/;

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
