#!/usr/bin/env node
"use strict";
process.title = 'aurelia-tools';
const doc = require('./doc');
const dev = require('./dev');
const build = require('./build');
const docShape = require('./doc-shape');
const docShapeDefs = require('./doc-shape-defs');
const path = require('path');
const rimraf = require('rimraf').sync;
const spawn = require('child_process').spawn;
const proxySpawned = require('./cli-util').proxySpawned;
const projectDir = process.cwd();
let tscPath;
try {
  tscPath = require.resolve(path.join(projectDir, 'node_modules', 'typescript/bin/tsc'));
} catch (_) {
  tscPath = require.resolve('typescript/bin/tsc');
}

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

const argv = require('yargs')
  .command('ts-build-all', 'Build multiple versions of the project', {
      project: {
        alias: 'p',
        describe: 'TypeScript project file or folder',
        type: 'string',
        default: 'tsconfig.build.json'
      },
      outDir: {
        alias: 'out',
        describe: 'Output directory for compilations',
        type: 'string',
        default: 'dist'
      },
      'continue-when-failed': {
        describe: 'Do not bail when one compilation fails',
        type: 'boolean',
        default: false
      },
      'clean-before': {
        describe: 'Clean outdir before compiling',
        type: 'boolean',
        default: false
      },
      'variation': {
        describe: 'Which variation to compile (or all if not defined)',
        type: 'array'
      }
    },
    function(argv) {
      if (argv.cleanBefore) {
        rimraf(argv.outDir);
      }

      let variations = [
        { module: "amd" },
        { module: "commonjs" },
        { module: "es2015", directory: "native-modules" },
        { module: "system" },
        { module: "es2015", target: "es2015" },
        { module: "es2015", target: "es2017" }
      ];

      if (argv.variation && argv.variation.length) {
        variations = variations.filter(v => 
          (v.target && argv.variation.includes(v.target)) || 
          (v.directory && argv.variation.includes(v.directory)) || 
          argv.variation.includes(v.module)
        )
      }

      variations.forEach(variation => {
        const outDir = variation.directory || variation.target || variation.module
        const args = [ tscPath, '--project', argv.project, '--outDir', path.join(argv.outDir, outDir), '--module', variation.module ];
        if (variation.target) {
          args.push('--target', variation.target);
        }
        console.log(`Running TypeScript compiler: ${args.join(' ')}`)
        const tsc = spawn('node', args);
        proxySpawned(tsc, outDir, argv.continueWhenFailed);
      });
    })
  .command('doc-jsonshape', 'Shape docs', {}, function(argv) {
    docShape.shape(argv._[1], argv._[2]);
  })
  .command('doc-shape-defs', 'Shape doc defs', {}, function(argv) {
    docShapeDefs.shapeDefs(argv._[1], argv._[2]);
  })
  .command('doc-build', 'Creates a single .d.ts from TS project', {
      project: {
        alias: 'p',
        describe: 'TypeScript project file or folder',
        type: 'string',
        default: 'tsconfig.build.json'
      },
      outDir: {
        alias: 'out',
        describe: 'Output for compilation',
        type: 'string',
        default: 'dist/doc-temp'
      },
      'continue-when-failed': {
        describe: 'Do not bail when one compilation fails',
        type: 'boolean',
        default: false
      }
    }, function(argv) {
    const packageJsonPath = path.resolve(projectDir, 'package.json');
    try {
      const packageName = require(packageJsonPath).name;
      rimraf('dist/doc-temp/**');
      const tsc = spawn( './node_modules/.bin/tsc', [ '--project', argv.project, '--outFile', path.join(argv.outDir, packageName + '.js') ] );
      proxySpawned(tsc, undefined, argv.continueWhenFailed);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  })
  .command('typedoc', 'Creates a typedoc file', {
    inDir: {
      alias: 'in',
      describe: 'Input d.ts files directory',
      type: 'string',
      default: 'dist/doc-temp'
    },
    outFile: {
      alias: 'o',
      describe: 'api.json output path',
      type: 'string',
      default: 'doc/api.json'
    },
    cleanUpInDir: {
      alias: 'clean',
      describe: 'removes the outdir',
      type: 'boolean',
      default: true
    },
    'continue-when-failed': {
      describe: 'Do not bail when one compilation fails',
      type: 'boolean',
      default: false
    },
    project: {
      alias: 'p',
      describe: 'TypeScript project file',
      type: 'string',
      default: path.resolve(__dirname, '../tsc/tsconfig.json')
    }
  }, function(argv) {
    const projectDir = process.cwd();
    const packageJsonPath = path.resolve(projectDir, 'package.json');
    try {
      const packageName = require(packageJsonPath).name;
      const typeDocPath = require.resolve('typedoc/bin/typedoc');
      rimraf('doc/api.json');
      
      const spawn = require( 'child_process' ).spawn;
      const typedoc = spawn( 'node', [ typeDocPath, '--json', argv.outFile, '--excludeExternals', '--includeDeclarations', '--mode', 'modules', '--target', 'ES6', '--name', packageName, '--ignoreCompilerErrors', '--tsconfig', argv.project, argv.inDir ] );
      proxySpawned(typedoc, undefined, argv.continueWhenFailed, function(code) {
        if (code === 0) {
          if (argv.cleanUpInDir) {
            rimraf(argv.inDir);
          }
        }
      });
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
    const standardVersion = require('standard-version');
    standardVersion({
      infile: argv._[1] || path.resolve(process.cwd(), 'doc/CHANGELOG.md'),
      message: 'chore(release): prepare release %s',
      firstRelease: argv.firstRelease,
      tagPrefix: ""
    }, function (err) {
      process.exit(1);
    });
  }).argv;
