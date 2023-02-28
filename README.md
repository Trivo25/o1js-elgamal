# Mina zkApp: Snarkyjs Elgamal

This repository implements Elgmal, a partial homomorphic encryption scheme originally described by [Taher Elgamal in 1985](https://caislab.kaist.ac.kr/lecture/2010/spring/cs548/basic/B02.pdf). This implementation includes the original version of Elgamal, which is multiplicative homomorphic, as well as slightly modified versions called Exponential Elgamal, which is multiplicative homomorphic over the cipher space, but additive homomorphic over the plain text space, and a version implementing Elgamal on elliptic curves.

## How to build

```sh
npm run build
```

## How to run tests

```sh
npm run test
npm run testw # watch mode
```

## How to run coverage

```sh
npm run coverage
```

## License

[Apache-2.0](LICENSE)
