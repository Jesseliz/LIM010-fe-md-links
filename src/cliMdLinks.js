const path = require('path');
const mdLinks = require('./main.js');

const cliMdLinks = (route, options) => new Promise((resolve, reject) => {
  mdLinks.mdLinks(route, options)
    .then((links) => {
      if (links.length === 0) {
        resolve('El archivo o directorio no cuentiene links');
      } else if (options && options.stats && options.validate) {
        resolve(mdLinks.OptionsValidateStats(route));
      } else if (options && options.stats) {
        resolve(mdLinks.optionStats(route));
      } else if (options && options.validate) {
        resolve(mdLinks.optionValidate(route));
      } else {
        const stringLinks = links.map((link) => `${path.relative(process.cwd(), link.filePath)} ${link.hrefPath} ${link.textPath}`);
        resolve(stringLinks.join('\n'));
      }
    }).catch((err) => {
      reject(err);
    });
});

// cliMdLinks('../test/testData').then((result) => console.log(result));

module.exports = { cliMdLinks };
