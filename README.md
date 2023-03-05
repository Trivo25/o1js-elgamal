# Snarkyjs Elgamal

This repository implements Elgmal, a partial homomorphic encryption scheme originally described by [Taher Elgamal in 1985](https://caislab.kaist.ac.kr/lecture/2010/spring/cs548/basic/B02.pdf). This implementation includes the original version of Elgamal, which is multiplicative homomorphic, as well as slightly modified versions called Exponential Elgamal, which is multiplicative homomorphic over the cipher space, but additive homomorphic over the plain text space, and a version implementing Elgamal on elliptic curves.

## ElGamal over an elliptic curve

## ElGamal over a finite field

## How to build

```sh
npm install
npm run build
npm run test
node build/src/examples/elgamalff.js
```

## License

[Apache-2.0](LICENSE)
