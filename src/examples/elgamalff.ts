import { Field, isReady, shutdown } from 'snarkyjs';
await isReady;

const { ElGamalFF } = await import('../elgamal.js');
let { pk, sk } = ElGamalFF.generateKeys();

let m1 = Field(15);
let m2 = Field(3);

let cipher = ElGamalFF.encrypt(m1, pk);

let plain = ElGamalFF.decrypt(cipher, sk);

console.log('valid decrypt?', plain.equals(m1).toBoolean());
shutdown();
