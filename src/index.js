var doc = require('./doc');
var dev = require('./dev');
var build = require('./build');

module.exports = {
  transformAPIModel:doc.transformAPIModel,
  updateOwnDependenciesFromLocalRepositories:dev.updateOwnDependenciesFromLocalRepositories,
  buildDevEnv:dev.buildDevEnv,
  pullDevEnv:dev.pullDevEnv,
  extractImports:build.extractImports,
  createImportBlock:build.createImportBlock,
  sortFiles:build.sortFiles,
  cleanGeneratedCode: build.cleanGeneratedCode
};
