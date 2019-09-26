#!/usr/bin/env node
const colors = require('colors');
const cliMdLinks = require('./cliMdLinks.js');

const route = process.argv[2];
// console.log(route);

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
  console.log(colors.red('Ingrese la ruta de un directorio o archivo'));
} else {
  cliMdLinks.cliMdLinks(route, options)
    .then((result) => {
      console.log(colors.cyan(result));
    }).catch((err) => {
      console.log(colors.red(err.message));
    });
}
