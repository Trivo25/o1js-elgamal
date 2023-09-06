import { Field, isReady, shutdown } from 'o1js';
await isReady;

const { ElGamalFF } = await import('../elgamal.js');
let { pk, sk } = ElGamalFF.generateKeys();

let m1 = Field(15);
let m2 = Field(3);

let c1 = ElGamalFF.encrypt(m1, pk);
let c2 = ElGamalFF.encrypt(m2, pk);

let plain1 = ElGamalFF.decrypt(c1, sk);
let plain2 = ElGamalFF.decrypt(c2, sk);

console.log('valid decrypt?', plain1.equals(m1).toBoolean());
console.log('valid decrypt?', plain2.equals(m2).toBoolean());

let c = c1.mul(c2);
let m3 = m1.mul(m2);

let plain3 = ElGamalFF.decrypt(c, sk);

console.log(
  `homomorphic multiplicative ${plain3.toString()} === ${m3.toString()}, ${m3
    .equals(plain3)
    .toBoolean()}`
);

shutdown();
