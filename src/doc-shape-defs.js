"use strict";

const path = require('path');
const fs = require('fs');

module.exports = {
  shapeDefs: function shapeDefs(directory, targetDir) {
    if (!directory) {
      directory = process.cwd();
    }
    if (!targetDir) {
      targetDir = 'dist/doc-temp';
    }
    if (!path.isAbsolute(targetDir)) {
      targetDir = path.resolve(directory, targetDir);
    }

    const packageJsonPath = path.resolve(directory, 'package.json');
    let packageName;
    try {
      packageName = require(packageJsonPath).name;
    } catch (e) {
      console.error(`Unable to shape the find the package.json file.`);
      console.error(e.message);
      return process.exit(1);
    }
    try {
      const dtsPath = path.join(targetDir, `${packageName}.d.ts`);
      let defs = fs.readFileSync(dtsPath).toString();

      // aggregate external imports
      const packages = {};
      const importRegex = /^\s*import\s+\{([^}]+)\}\s*from\s*'([\w|-]+)'/gm;
      let importMatch  = importRegex.exec(defs);
      while (importMatch) {
        const packageName = importMatch[2];
        const imports = packages[packageName] || (packages[packageName] = []);
        const bindings = importMatch[1].split(',').map(x => x.trim());
        for (let binding of bindings) {
          if (imports.indexOf(binding) === -1) {
            imports.push(binding);
          }
        }
        importMatch = importRegex.exec(defs);
      }

      // remove leading declare module
      defs = defs.replace(/^declare module ".*" \{/, '');
      // remove "} declare module {"
      defs = defs.replace(/\}\r?\ndeclare module ".*" \{/g, '');
      // remove closing "}"
      defs = defs.replace(/\}\r?\n$/, '');
      // remove imports
      defs = defs.replace(/^\s+import.*;$/gm, '');
      // remove "export *"
      defs = defs.replace(/^\s+export \*.*;$/gm, '');

      // write imports
      for (let packageName in packages) {
        if (packages.hasOwnProperty(packageName)) {
          const imports = packages[packageName];
          defs = `import {${imports.sort()}} from '${packageName}';\n` + defs;
        }
      }

      fs.writeFileSync(dtsPath, defs);
      console.log(`Shaped the ${packageName}.d.ts file.`);
    } catch (e) {
      console.error(`Unable to shape the ${packageName}.d.ts file.`);
      console.error(e.message);
      return process.exit(1);
    }
  }
}
