#!/usr/bin/env node

/* const [,, ...args] = process.argv;
console.log(`Hello world ${args}`); */

const mdLinks = require('./main.js');

const route = process.argv[2];

const options = {
  stats: false,
  validate: false,
};

process.argv.forEach((element) => {
  if (element === '--stats' || element === '--s' || element === 's') {
    options.stats = true;
  }
  if (element === '--validate' || element === '--v' || element === 'v') {
    options.validate = true;
  }
});

if (!route) {
  console.log('Ingresa la ruta de un directorio o archivo');
} else {
  mdLinks.mdLinks(route, options)
    .then((links) => {
      if (links.length === 0) {
        console.log('El archivo o directorio no cuentiene links');
      } else if (options.stats && options.validate) {
        mdLinks.OptionsValidateStats(route).then((result) => console.log(result));
      } else if (options.stats) {
        mdLinks.optionStats(route).then((result) => console.log(result));
      } else if (options.validate) {
        mdLinks.optionValidate(route).then((result) => console.log(result));
      } else {
        const stringLinks = links.map((link) => `${link.filePath}  ${link.hrefPath}  ${link.textPath}`);
        console.log(stringLinks.join('\n '));
      }
    }).catch((err) => {
      console.log(err.message);
    });
}

module.exports = mdLinks;
