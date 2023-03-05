import {
  Field,
  Group,
  isReady,
  PrivateKey,
  PublicKey,
  shutdown,
} from 'snarkyjs';
import { ElGamalECC, ElGamalFF } from './elgamal';

describe('ElGamal', () => {
  let sk: PrivateKey;
  let pk: PublicKey;

  beforeAll(async () => {
    await isReady;
    sk = PrivateKey.random();
    pk = sk.toPublicKey();
  });

  afterAll(() => {
    setTimeout(() => shutdown(), 0);
  });

  describe('ElGamal EC', () => {
    it('Should encrypt and decrypt correctly', () => {
      const msg = Group.fromJSON({
        x: 5,
        y: 5,
      })!;

      const cipher = ElGamalECC.encrypt(msg, pk);

      const plain = ElGamalECC.decrypt(cipher, sk);

      plain.assertEquals(msg);
    });
  });

  describe('ElGamal FF', () => {
    it('Should encrypt and decrypt correctly', () => {
      const m1 = Field(5);

      const { pk, sk } = ElGamalFF.generateKeys();

      const c1 = ElGamalFF.encrypt(m1, pk);

      const plain = ElGamalFF.decrypt(c1, sk);

      plain.assertEquals(m1);
    });

    it('Homomorphic properties should hold, m1*m2', () => {
      const { pk, sk } = ElGamalFF.generateKeys();

      const m1 = Field(15);
      const m2 = Field(3);

      const c1 = ElGamalFF.encrypt(m1, pk);
      const c2 = ElGamalFF.encrypt(m2, pk);

      const plain1 = ElGamalFF.decrypt(c1, sk);
      const plain2 = ElGamalFF.decrypt(c2, sk);

      plain1.assertEquals(m1);
      plain2.assertEquals(m2);

      const c3 = c1.mul(c2);

      const plain3 = ElGamalFF.decrypt(c3, sk);

      const m3 = m1.mul(m2);
      plain3.assertEquals(m3);
    });

    it('Homomorphic properties should hold, m1*m2*m3', () => {
      const { pk, sk } = ElGamalFF.generateKeys();

      const m1 = Field(15);
      const m2 = Field(3);
      const m3 = Field(2);

      const c1 = ElGamalFF.encrypt(m1, pk);
      const c2 = ElGamalFF.encrypt(m2, pk);
      const c3 = ElGamalFF.encrypt(m3, pk);

      const plain1 = ElGamalFF.decrypt(c1, sk);
      const plain2 = ElGamalFF.decrypt(c2, sk);
      const plain3 = ElGamalFF.decrypt(c3, sk);

      plain1.assertEquals(m1);
      plain2.assertEquals(m2);
      plain3.assertEquals(m3);

      const c4 = c1.mul(c2).mul(c3);

      const plain4 = ElGamalFF.decrypt(c4, sk);

      const m4 = m1.mul(m2).mul(m3);
      plain4.assertEquals(m4);
    });
  });
});
