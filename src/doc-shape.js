"use strict";

const path = require('path');
const fs = require('fs');

module.exports = {
  shape: function shape(apiJsonPath, directory) {
    if (!directory) {
      directory = process.cwd()
    }
    if (!apiJsonPath) {
      apiJsonPath = 'api.json'
    }
    if (!path.isAbsolute(apiJsonPath)) {
      apiJsonPath = path.resolve(directory, apiJsonPath)
    }
    const packageJsonPath = path.resolve(directory, 'package.json');

    try {
      const packageName = require(packageJsonPath).name;
      let json = require(apiJsonPath).children[0];

      json = {
        name: packageName,
        children: json.children,
        groups: json.groups
      };

      const str = JSON.stringify(json) + '\n';
      fs.writeFileSync(apiJsonPath, str);
      console.log('Shaped the api.json file.');
    } catch (e) {
      console.error('Unable to shape the api.json. The file probably has an incorrect format or doesn\'t exist.');
      console.error(e.message);
      return process.exit(1);
    }
  }
}
