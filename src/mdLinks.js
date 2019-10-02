// retorna una promesa con los links del path
const fs = require('fs');
const path = require('path');
const mainFunctions = require('../src/main.js');

const mdLinks = (route, options) => new Promise((resolve, reject) => {
  if (fs.existsSync(route)) {
    if (options && options.validate) {
      resolve(mainFunctions.linksValidate(route));
    } else {
      resolve(mainFunctions.readFileMd(route));
    }
  } else {
    reject(new Error(`No se encuentra la ruta: ${path.resolve(route)}`));
  }
});

module.exports = { mdLinks };
