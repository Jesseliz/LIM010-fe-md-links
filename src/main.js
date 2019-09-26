const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');

const convertToAbsolutePath = (route) => (path.isAbsolute(route) ? route : path.resolve(route));

const readMdExtend = (route) => (path.extname(route) === '.md');

// devuelve todos los archivos md
const saveMdFile = (route) => {
  if (fs.statSync(route).isDirectory()) {
    const arrDataFiles = fs.readdirSync(route);
    // console.log(arrDataFiles); //[ 'prueba.md', 'prueba.txt', 'subPath' ] [ 'subPrueba.md' ]
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

const linksValidate = (route) => {
  const arrObjLinks = readFileMd(route);
  const arrLinks = arrObjLinks.map((link) => link.hrefPath);
  const promises = arrLinks.map((link) => fetch(link));
  return Promise.all(promises)
    .then((response) => {
      const validateLinks = arrObjLinks.map((objLinks, statsLink) => {
        if (response[statsLink].ok) {
          objLinks.statusText = response[statsLink].statusText;
          objLinks.status = response[statsLink].status;
        } else {
          objLinks.statusText = 'FAIL';
          objLinks.status = response[statsLink].status;
        }
        return objLinks;
      });
      return validateLinks;
    });
};
// linksValidate('../test/testData').then((response) => console.log(response));

const optionValidate = (route) => new Promise((resolve) => {
  linksValidate(route)
    .then((arrLinks) => {
      const strLinks = arrLinks.map((link) => `${link.filePath} ${link.hrefPath} ${link.statusText} ${link.status} ${link.textPath}`);
      resolve(strLinks.join('\n '));
    });
});

// optionValidate('../test/testData').then((response) => console.log(response));

const uniqueLinks = (arrLinks) => [...new Set(arrLinks.map((link) => link.hrefPath))];
const brokenLinks = (arrValidateLinks) => arrValidateLinks.filter((link) => link.status >= 400);

const optionStats = (route) => new Promise((resolve) => {
  const arrMdLinks = readFileMd(route);
  resolve(`Total: ${arrMdLinks.length}\nUnique: ${uniqueLinks(arrMdLinks).length}`);
});

const OptionsValidateStats = (route) => new Promise((resolve) => {
  linksValidate(route)
    .then((links) => {
      resolve(`Total: ${links.length}\nUnique: ${uniqueLinks(links).length}\nBroken: ${brokenLinks(links).length}`);
    });
});

// OptionsValidateStats('../test/testData/prueba.md').then((response) => { console.log(response); });

// console.log(uniqueLinks(readFileMd('../test/testData')).length);

const mdLinks = (route, options) => new Promise((resolve, reject) => {
  if (fs.existsSync(route)) {
    if (options && options.validate) {
      resolve(linksValidate(route));
    } else {
      resolve(readFileMd(route));
    }
  } else {
    reject(new Error(`No se encuentra la ruta: ${path.resolve(route)}`));
  }
});

/* mdLinks('../test/testData', { validate: true }).then((response) => {
  console.log(response);
});    */

/* mdLinks('../test/testData').then((response) => {
  console.log(response);
});  */

// console.log(mdLinks('../src'));

module.exports = {
  convertToAbsolutePath,
  readMdExtend,
  saveMdFile,
  readFileMd,
  linksValidate,
  uniqueLinks,
  brokenLinks,
  mdLinks,
  optionStats,
  OptionsValidateStats,
  optionValidate,
};
