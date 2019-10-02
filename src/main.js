const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');

const convertToAbsolutePath = (route) => (path.isAbsolute(route) ? route : path.resolve(route));

const readMdExtend = (route) => (path.extname(route) === '.md');

// Función que devuelve todos los archivos md
const saveMdFile = (route) => {
  if (fs.statSync(route).isDirectory()) {
    const arrDataFiles = fs.readdirSync(route); // [ 'prueba.md', 'prueba.txt', 'subPath' ]
    const allDataPaths = arrDataFiles.reduce((arrTotalPaths, currentFilePaths) => {
      const absolutePaths = path.resolve(route, currentFilePaths);
      const pathsArr = saveMdFile(absolutePaths);
      return arrTotalPaths.concat(pathsArr);
    }, []);
    return allDataPaths;
  }
  const filePath = convertToAbsolutePath(route);
  if (readMdExtend(filePath)) {
    return [filePath];
  }
  return [];
};
// console.log(saveMdFile('../test/testData/'));

// Función que devuelve un array de objetos con href, text, file
const readFileMd = (route) => {
  const links = [];
  const renderer = new marked.Renderer();
  const arrFiles = saveMdFile(route);
  // recorre el array de rutas
  arrFiles.forEach((file) => {
    // leer el archivo de la ruta
    const filesData = fs.readFileSync(file, 'utf8');
    // busca los links de cada archivo
    renderer.link = (href, title, text) => {
      // Guardar los links en un array de objetos
      links.push({ hrefPath: href, textPath: text, filePath: file });
    };
    marked(filesData, { renderer });
  });
  return links;
};

// Función para validar los links OK or FAIL
const linksValidate = (route) => {
  const arrObjLinks = readFileMd(route);
  const arrLinksPromise = arrObjLinks.map((link) => fetch(link.hrefPath)
    .then((response) => {
      if (response.ok) {
        return {
          ...link,
          statusText: response.statusText,
          status: response.status,
        };
      }
      return {
        ...link,
        statusText: 'FAIL',
        status: response.status,
      };
    })
    .catch(() => ({
      ...link,
      statusText: 'FAIL',
      status: 'ERROR',
    })));
  return Promise.all(arrLinksPromise);
};

// refactorizar el then y catch por cada fetch y al final retornar el promise por cada fetch

// linksValidate('../test/testData/prueba.md').then((response) => console.log(response));

// Función que devuelve en string los links validados
const optionValidate = (route) => new Promise((resolve) => {
  linksValidate(route)
    .then((arrLinks) => {
      const strLinks = arrLinks.map((link) => `${path.relative(process.cwd(), link.filePath)} ${link.hrefPath} ${link.statusText} ${link.status} ${link.textPath}`);
      resolve(strLinks.join('\n'));
    });
});

// optionValidate('../test/testData/').then((response) => console.log(response));

const uniqueLinks = (arrLinks) => [...new Set(arrLinks.map((link) => link.hrefPath))];
const brokenLinks = (arrValidateLinks) => arrValidateLinks.filter((link) => link.status >= 400);

// Función que devuelve los stats de los links en string
const optionStats = (route) => new Promise((resolve) => {
  const arrMdLinks = readFileMd(route);
  resolve(`Total: ${arrMdLinks.length}\nUnique: ${uniqueLinks(arrMdLinks).length}`);
});

// Función que devuelve los stats y validación de los links en string
const OptionsValidateStats = (route) => new Promise((resolve) => {
  linksValidate(route)
    .then((links) => {
      resolve(`Total: ${links.length}\nUnique: ${uniqueLinks(links).length}\nBroken: ${brokenLinks(links).length}`);
    });
});

/* mdLinks('../test/testData', { validate: true }).then((response) => {
  console.log(response);
}); */

/* mdLinks('../test/testData').then((response) => {
  console.log(response);
});  */

module.exports = {
  convertToAbsolutePath,
  readMdExtend,
  saveMdFile,
  readFileMd,
  linksValidate,
  uniqueLinks,
  brokenLinks,
  optionStats,
  OptionsValidateStats,
  optionValidate,
};
