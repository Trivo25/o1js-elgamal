import { Group, isReady, PrivateKey, PublicKey, shutdown } from 'snarkyjs';
import { ElGamalECC } from './elgamal';

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
});
