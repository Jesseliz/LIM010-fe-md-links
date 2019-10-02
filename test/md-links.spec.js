const path = require('path');
const moduleImport = require('../src/main.js');
const mdLinks = require('../src/mdLinks.js');
const cliImport = require('../src/cliMdLinks.js');

const testDirectory = path.join(process.cwd(), 'test');
const mdFile = path.join(process.cwd(), 'test', 'testData', 'prueba.md');
const subMdFile = path.join(testDirectory, 'testData', 'subPath', 'subPrueba.md');
const relativePath = path.join('test', 'testData', 'prueba.md');
// console.log(relativePath);

const readFileMdArray = {
  hrefPath: 'https://es.wikipedia.org/wiki/Markdown',
  textPath: 'Markdown',
  filePath: mdFile,
};

const linkOk = {
  hrefPath: 'https://es.wikipedia.org/wiki/Markdown',
  textPath: 'Markdown',
  filePath: mdFile,
  statusText: 'OK',
  status: 200,
};

const linkFail = {
  hrefPath: 'https://nodejs.org/es/abou1t/',
  textPath: 'Node.js',
  filePath: mdFile,
  statusText: 'FAIL',
  status: 404,
};

describe('Convert To AbsoluteRute', () => {
  it('Should be a function', () => {
    expect(typeof moduleImport.convertToAbsolutePath).toBe('function');
  });
  it('Should convert a relative path to absolute path', () => {
    expect(moduleImport.convertToAbsolutePath('test')).toBe(testDirectory);
  });
  it('Should return the same absolute path', () => {
    expect(moduleImport.convertToAbsolutePath(testDirectory)).toBe(testDirectory);
  });
});

describe('is MD file?', () => {
  it('Should return true if the file has a MD extension', () => {
    expect(moduleImport.readMdExtend(mdFile)).toBe(true);
  });
  it('Debería retornar false si el archivo no tiene la extensión md', () => {
    expect(moduleImport.readMdExtend(testDirectory)).toBe(false);
  });
});

describe('Find MdFile', () => {
  it('should return a md file', () => {
    expect(Array.isArray(moduleImport.saveMdFile(testDirectory))).toBe(true);
    expect(moduleImport.saveMdFile(testDirectory)[0]).toEqual(mdFile);
  });
  it('Should return all MD files of the directory and subdirectory', () => {
    expect(Array.isArray(moduleImport.saveMdFile(testDirectory))).toBe(true);
    expect(moduleImport.saveMdFile(testDirectory)).toEqual([mdFile, subMdFile]);
  });
});

describe('Read Md file links', () => {
  it('Should read the href, text and filepath in the md file', () => {
    expect(Array.isArray(moduleImport.readFileMd(mdFile))).toBe(true);
    expect(moduleImport.readFileMd(mdFile)[0]).toEqual(readFileMdArray);
  });
});

describe('Validate links', () => {
  it('Should return a promisse with OK status', () => moduleImport.linksValidate(mdFile)
    .then((result) => {
      expect(result[0]).toEqual(linkOk);
    }));

  it('Should return a promisse with FAIL status', () => moduleImport.linksValidate(mdFile)
    .then((result) => {
      expect(result[1]).toEqual(linkFail);
    }));
});

describe('option stats', () => {
  it('Should return links statistics in a string', () => moduleImport.optionStats(mdFile)
    .then((result) => {
      expect(result).toEqual('Total: 3\nUnique: 3');
    }));
});

describe('option validate and stats', () => {
  it('Should return the links statistics and links validations in a string', () => moduleImport.OptionsValidateStats(mdFile)
    .then((result) => {
      expect(result).toEqual('Total: 3\nUnique: 3\nBroken: 1');
    }));
});

describe('option validate', () => {
  it('Should return the validated links', () => moduleImport.optionValidate(mdFile)
    .then((result) => {
      expect(result).toEqual(`${relativePath} https://es.wikipedia.org/wiki/Markdown OK 200 Markdown\n${relativePath} https://nodejs.org/es/abou1t/ FAIL 404 Node.js\n${relativePath} https://developer.mo3zilla.org/ FAIL ERROR roto`);
    }));
});

describe('mdLinks', () => {
  it('Should return an array of link objects', () => mdLinks.mdLinks(mdFile)
    .then((result) => {
      expect(result[0]).toEqual(readFileMdArray);
    }));
  it('should return an array of objects with validated links', () => mdLinks.mdLinks(mdFile, { validate: true })
    .then((result) => {
      expect(result[0]).toEqual(linkOk);
    }));
  it('should show a message: No se encuentra la ruta', () => mdLinks.mdLinks('no-route')
    .catch((err) => {
      expect(err.message).toEqual(`No se encuentra la ruta: ${path.join(process.cwd(), 'no-route')}`);
    }));
});

describe('cli mdlinks', () => {
  it('should show a message: El archivo o directorio no cuentiene links ', () => cliImport.cliMdLinks(path.join(process.cwd(), 'src'))
    .then((result) => {
      expect(result).toEqual('El archivo o directorio no cuentiene links');
    }));

  it('should return an string with the validation and status of the links', () => cliImport.cliMdLinks(mdFile, { validate: true, stats: true })
    .then((result) => {
      expect(result).toEqual('Total: 3\nUnique: 3\nBroken: 1');
    }));

  it('should return an string with the status of the links', () => cliImport.cliMdLinks(mdFile, { stats: true })
    .then((result) => {
      expect(result).toEqual('Total: 3\nUnique: 3');
    }));

  it('should return an string with validated links', () => cliImport.cliMdLinks(mdFile, { validate: true })
    .then((result) => {
      expect(result).toEqual(`${relativePath} https://es.wikipedia.org/wiki/Markdown OK 200 Markdown\n${relativePath} https://nodejs.org/es/abou1t/ FAIL 404 Node.js\n${relativePath} https://developer.mo3zilla.org/ FAIL ERROR roto`);
    }));

  it('should return an string with the links', () => cliImport.cliMdLinks(mdFile)
    .then((result) => {
      expect(result).toEqual(`${relativePath} https://es.wikipedia.org/wiki/Markdown Markdown\n${relativePath} https://nodejs.org/es/abou1t/ Node.js\n${relativePath} https://developer.mo3zilla.org/ roto`);
    }));

  it('should show a message: No se encuentra la ruta', () => cliImport.cliMdLinks('no-route')
    .catch((err) => {
      expect(err.message).toEqual(`No se encuentra la ruta: ${path.join(process.cwd(), 'no-route')}`);
    }));
});
