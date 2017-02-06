const doc = require('./doc');
const dev = require('./dev');
const build = require('./build');
const docShape = require('./doc-shape');
const docShapeDefs = require('./doc-shape-defs');


module.exports = {
  transformAPIModel:doc.transformAPIModel,
  updateOwnDependenciesFromLocalRepositories:dev.updateOwnDependenciesFromLocalRepositories,
  buildDevEnv:dev.buildDevEnv,
  pullDevEnv:dev.pullDevEnv,
  extractImports:build.extractImports,
  createImportBlock:build.createImportBlock,
  sortFiles:build.sortFiles,
  cleanGeneratedCode: build.cleanGeneratedCode,
  docShapeDefs: docShapeDefs.shapeDefs,
  docShape: docShape.shape
};

