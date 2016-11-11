#!/usr/bin/env node
"use strict";
process.title = 'aurelia-tools';
var doc = require('./doc');
var dev = require('./dev');
var build = require('./build');
var docShape = require('./doc-shape');
var docShapeDefs = require('./doc-shape-defs');
var path = require('path');

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
    docShape.shape(argv._[1], argv._[2]);
  })
  .command('doc-shape-defs', 'Shape doc defs', {}, function(argv) {
    docShapeDefs.shapeDefs(argv._[1], argv._[2]);
  })
  .command('build-doc', 'Creates a single .d.ts from TS project', {
      project: {
        alias: 'p',
        describe: 'TSC project file or folder',
        type: 'string',
        default: 'tsconfig.build.json'
      },
      outDir: {
        alias: 'out',
        describe: 'Output for compilation',
        type: 'string',
        default: 'dist/doc-temp'
      }
    }, function(argv) {
    const projectDir = process.cwd();
    const packageJsonPath = path.resolve(projectDir, 'package.json');
    try {
      const packageName = require(packageJsonPath).name;
      const spawn = require( 'child_process' ).spawnSync;
      const rimraf = require('rimraf').sync;
      rimraf([ 'doc/api.json', 'dist/doc-temp/**' ]);
      const tsc = spawn( './node_modules/.bin/tsc', [ '--project', argv.project, '--outFile', path.join(argv.outDir, packageName + '.js') ] );
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  })
  .command('typedoc', 'Creates a typedoc file', {,
    inDir: {
      alias: 'in',
      describe: 'Input d.ts files directory',
      type: 'string',
      default: 'dist/doc-temp'
    }
    outFile: {
      alias: 'o',
      describe: 'api.json output path',
      type: 'string',
      default: 'doc/api.json'
    }
  }, function(argv) {
    const projectDir = process.cwd();
    const packageJsonPath = path.resolve(projectDir, 'package.json');
    try {
      const packageName = require(packageJsonPath).name;
      const typeDocPath = path.join(path.dirname(require.resolve('typedoc')), 'bin/typedoc');
      const spawn = require( 'child_process' ).spawnSync;
      const typedoc = spawn( 'node', [ typeDocPath, '--json', argv.outFile, '--excludeExternals', '--includeDeclarations', '--mode', 'modules', '--target', 'ES6', '--name', packageName, '--ignoreCompilerErrors', argv.inDir ] );
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
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
    standardVersion({
      infile: argv._[1] || path.resolve(process.cwd(), 'doc/CHANGELOG.md'),
      message: 'chore(release): prepare release %s',
      firstRelease: argv.firstRelease
    }, function (err) {
      process.exit(1);
    });
  }).argv
