import { isReady, shutdown, Field } from 'o1js';
import { modExp } from './lib';

describe('lib', () => {
  beforeAll(async () => {
    await isReady;
  });

  afterAll(() => {
    setTimeout(() => shutdown(), 0);
  });

  describe('modExp', () => {
    // this works fine for small values, but will get tricky for huge ones
    it('Should calculate g^x', () => {
      let base = 5;
      let exponent = 15;
      modExp(Field(base), Field(exponent)).assertEquals(
        Field(base ** exponent)
      );
    });
    it('Should calculate g^x', () => {
      let base = 85;
      let exponent = 8;
      modExp(Field(base), Field(exponent)).assertEquals(
        Field(base ** exponent)
      );
    });
    it('Should calculate g^x', () => {
      let base = 71;
      let exponent = 3;
      modExp(Field(base), Field(exponent)).assertEquals(
        Field(base ** exponent)
      );
    });
    it('Should calculate g^x', () => {
      let base = 1;
      let exponent = 32;
      modExp(Field(base), Field(exponent)).assertEquals(
        Field(base ** exponent)
      );
    });
    it('Should calculate g^x', () => {
      let base = 2;
      let exponent = 32;
      modExp(Field(base), Field(exponent)).assertEquals(
        Field(base ** exponent)
      );
    });
    it('Should calculate g^x', () => {
      let base = 32;
      let exponent = 2;
      modExp(Field(base), Field(exponent)).assertEquals(
        Field(base ** exponent)
      );
    });
    it('Should calculate g^x', () => {
      let base = 70;
      let exponent = 2;
      modExp(Field(base), Field(exponent)).assertEquals(
        Field(base ** exponent)
      );
    });
  });
});
