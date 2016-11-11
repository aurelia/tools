#!/usr/bin/env node
"use strict";
process.title = 'aurelia-tools';
var doc = require('./doc');
var dev = require('./dev');
var build = require('./build');
var docShape = require('./doc-shape');
var docShapeDefs = require('./doc-shape-defs');

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

var argv = require('yargs')
  .command('doc-shape', 'Shape docs', {}, function(argv) {
    docShape.shape(argv._[1], argv._[2])
  })
  .command('doc-shape-defs', 'Shape doc defs', {}, function(argv) {
    docShapeDefs.shapeDefs(argv._[1], argv._[2])
  })
  .command('changelog', 'Generate changelog from commits', { 
    'first-release': {
      alias: 'f',
      describe: 'Is this the first release?',
      type: 'boolean',
      default: false
    }
  }, function(argv) {
    console.log(argv)
    var standardVersion = require('standard-version');
    var path = require('path');
    standardVersion({
      infile: argv._[1] || path.resolve(process.cwd(), 'doc/CHANGELOG.md'),
      message: 'chore(release): prepare release %s',
      firstRelease: argv.firstRelease
    }, function (err) {
      process.exit(1)
    });
  }).argv
