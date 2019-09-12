
import { readPath, convertToAbsoluteRute } from '../src/main.js';

const path = 'C:\\Users\\Yesseliz\\Desktop\\LIM010-fe-md-links\\test\\testData\\prueba.md';
const relativePath = 'test/testData/prueba.md';
const noPath = '/none.md';
describe('validatePath', () => {
  it('Debería ser una función', () => {
    expect(typeof readPath).toBe('function');
  });
  it('Debería retornar true si el string ingresado es una ruta', () => {
    expect(readPath(path)).toEqual(true);
  });
  it('Debería retornar false si el string ingresado no es una ruta', () => {
    expect(readPath(noPath)).toEqual(false);
  });
});

describe('convertToAbsoluteRute', () => {
  it('Debería ser una función', () => {
    expect(typeof convertToAbsoluteRute).toBe('function');
  });
  it('Debería convertir una ruta relativa en absoluta', () => {
    expect(convertToAbsoluteRute(relativePath)).toBe(path);
  });
});
