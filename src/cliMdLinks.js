const path = require('path');
const mainFunctions = require('./main.js');
const mdLinks = require('./mdLinks.js');

const cliMdLinks = (route, options) => new Promise((resolve, reject) => {
  mdLinks.mdLinks(route, options)
    .then((links) => {
      if (links.length === 0) {
        resolve('El archivo o directorio no cuentiene links');
      } else if (options && options.stats && options.validate) {
        resolve(mainFunctions.OptionsValidateStats(route));
      } else if (options && options.stats) {
        resolve(mainFunctions.optionStats(route));
      } else if (options && options.validate) {
        resolve(mainFunctions.optionValidate(route));
      } else {
        const stringLinks = links.map((link) => `${path.relative(process.cwd(), link.filePath)} ${link.hrefPath} ${link.textPath}`);
        resolve(stringLinks.join('\n'));
      }
    }).catch((err) => {
      reject(err);
    });
});

module.exports = { cliMdLinks };
