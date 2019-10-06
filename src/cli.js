const colors = require('colors');
const cliMdLinks = require('./cliMdLinks.js');

const route = process.argv[2];
const options = {
  stats: false,
  validate: false,
};

process.argv.forEach((element) => {
  if (element === '--stats' || element === '--s' || element === 's' || element === 'S') {
    options.stats = true;
  }
  if (element === '--validate' || element === '--v' || element === 'v' || element === 'V') {
    options.validate = true;
  }
});

if (!route) {
  console.log(colors.red('Ingrese la ruta de un directorio o archivo'));
} else {
  cliMdLinks.cliMdLinks(route, options)
    .then((result) => {
      console.log(colors.yellow(result));
    }).catch((err) => {
      console.log(colors.red(err.message));
    });
}
