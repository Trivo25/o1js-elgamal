# o1js Elgamal

This repository implements Elgmal, a partial homomorphic encryption scheme originally described by [Taher Elgamal in 1985](https://caislab.kaist.ac.kr/lecture/2010/spring/cs548/basic/B02.pdf). This implementation includes the original version of Elgamal, which is multiplicative homomorphic, as well as slightly modified versions called Exponential Elgamal, which is multiplicative homomorphic over the cipher space, but additive homomorphic over the plain text space, and a version implementing Elgamal on elliptic curves.

## ElGamal over a finite field

### Usage

Install the package `npm i o1js-elgamal`

Import the ElGamal finite field class as well as the cipher class.

```ts
import { Cipher, ElGamalFF } from 'o1js-elgamal';
```

Generate a secret and public key. The secret key is used to _decrypt_, whereas the public key is used to _encrypt_ a message.

```ts
let { pk, sk } = ElGamalFF.generateKeys();
```

Encrypt two messages using the public key.

```ts
let c1 = ElGamalFF.encrypt(Field(5), pk)
let c2 = ElGamalFF.encrypt(Field(5), pk)
```

Demonstrate the multiplicative homomorphism over the plain text space by multiplying the ciphers.

```ts
let c3 = c1.mul(c2)
```

Decrypt the cipher `c3` using the secret key.

```ts
let plain = ElGamalFF.decrypt(c3, sk);
```

Check that the decrypted text equals the expected output of `5 * 5 = 25`.

```ts
plain.assertEquals(Field(5).mul(5));
```

### Usage in a Mina smart contract

Take a look at at the example which uses [ElGamal within a Mina smart contract](https://github.com/Trivo25/o1js-elgamal/tree/main/src/examples).

## ElGamal over an elliptic curve

_TBD_

## How to build

```sh
npm install
npm run build
npm run test
node build/src/examples/elgamalff.js
```

## License

[Apache-2.0](LICENSE)
