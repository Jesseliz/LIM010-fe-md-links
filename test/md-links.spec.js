const path = require('path');
const moduleImport = require('../src/main.js');
const cliImport = require('../src/cliMdLinks.js');

const testDirectory = path.join(process.cwd(), 'test');
const mdFile = path.join(process.cwd(), 'test', 'testData', 'prueba.md');
const subMdFile = path.join(testDirectory, 'testData', 'subPath', 'subPrueba.md');
const relativePath = 'test\\testData\\prueba.md';

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
  it('Deberia retornar las estadísticas del link en un string', () => moduleImport.optionStats(mdFile)
    .then((result) => {
      expect(result).toEqual('Total: 2\nUnique: 2');
    }));
});

describe('option validate and stats', () => {
  it('Deberia retornar las estadísticas y validaciones del link en un string', () => moduleImport.OptionsValidateStats(mdFile)
    .then((result) => {
      expect(result).toEqual('Total: 2\nUnique: 2\nBroken: 1');
    }));
});

describe('option validate', () => {
  it('Deberia retornar los links validados', () => moduleImport.optionValidate(mdFile)
    .then((result) => {
      expect(result).toEqual(`${relativePath} https://es.wikipedia.org/wiki/Markdown OK 200 Markdown\n${relativePath} https://nodejs.org/es/abou1t/ FAIL 404 Node.js`);
    }));
});

describe('mdLinks', () => {
  it('Deberia retornar un array de objetos del link', () => moduleImport.mdLinks(mdFile)
    .then((result) => {
      expect(result[0]).toEqual(readFileMdArray);
    }));
  it('Deberia retornar un array de objetos con los links validados', () => moduleImport.mdLinks(mdFile, { validate: true })
    .then((result) => {
      expect(result[0]).toEqual(linkOk);
    }));
  it('Deberia mostrar un mensaje: No se encuentra la ruta', () => moduleImport.mdLinks('no-route')
    .catch((err) => {
      expect(err.message).toEqual(`No se encuentra la ruta: ${path.join(process.cwd(), 'no-route')}`);
    }));
});

describe('cli mdlinks', () => {
  it('Deberia retornar un mensaje: El archivo o directorio no cuentiene links ', () => cliImport.cliMdLinks(path.join(process.cwd(), 'src'))
    .then((result) => {
      expect(result).toEqual('El archivo o directorio no cuentiene links');
    }));

  it('Deberia retornar un string: con la validacion y estado de los links ', () => cliImport.cliMdLinks(mdFile, { validate: true, stats: true })
    .then((result) => {
      expect(result).toEqual('Total: 2\nUnique: 2\nBroken: 1');
    }));

  it('Deberia retornar un string: con el estado de los links ', () => cliImport.cliMdLinks(mdFile, { stats: true })
    .then((result) => {
      expect(result).toEqual('Total: 2\nUnique: 2');
    }));

  it('Deberia retornar un string: con los links validados', () => cliImport.cliMdLinks(mdFile, { validate: true })
    .then((result) => {
      expect(result).toEqual(`${relativePath} https://es.wikipedia.org/wiki/Markdown OK 200 Markdown\n${relativePath} https://nodejs.org/es/abou1t/ FAIL 404 Node.js`);
    }));

  it('Deberia retornar un string: con los links', () => cliImport.cliMdLinks(mdFile)
    .then((result) => {
      expect(result).toEqual(`${relativePath} https://es.wikipedia.org/wiki/Markdown Markdown\n${relativePath} https://nodejs.org/es/abou1t/ Node.js`);
    }));

  it('Deberia mostrar un mensaje: No se encuentra la ruta', () => cliImport.cliMdLinks('no-route')
    .catch((err) => {
      expect(err.message).toEqual(`No se encuentra la ruta: ${path.join(process.cwd(), 'no-route')}`);
    }));
});
