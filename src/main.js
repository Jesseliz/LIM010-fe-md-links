/* eslint-disable global-require */
// Leer la ruta y preguntar si es una ruta absoluta  

const path = require('path');
const fs = require('fs');

const readPath = (userPath)=>{
  if (fs.existsSync(userPath)) {
    return true;
  } return false;

};
const convertToAbsoluteRute = (newRute) => {
  if (!path.isAbsolute(newRute)) {
    const resolve = path.resolve(newRute);
    return resolve;
  } return newRute;
};
//  console.log(convertToAbsoluteRute('../Yesseliz/Downloads'));

// console.log(path.resolve('../Yesseliz/Downloads'));
const readMdExtend = (userPath) => {
  const pathExt = path.extname(userPath);

  if (pathExt === '.md') {
    return true;
  }
  return false;
};

export {readPath, convertToAbsoluteRute, readMdExtend }
