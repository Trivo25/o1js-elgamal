import { Bool, Circuit, Field } from 'snarkyjs';
import { ElGamalFF } from './elgamal.js';
import fs from 'fs';
export { modExp, discreteLog, generateLookup, lookUp };

/**
 * Modular exponentiation `base^exponent`, based on a variant of the [square-and-multiply](https://en.wikipedia.org/wiki/Exponentiation_by_squaring) algorithm.
 */
function modExp(base: Field, exponent: Field) {
  let bits = exponent.toBits();
  let n = base;

  // this keeps track of when we can start accumulating
  let start = Bool(false);

  // we have to go in reverse order here because .toBits is in LSB representation, but we need MSB for the algorithm to function
  for (let i = 254; i >= 0; i--) {
    let bit = bits[i];

    // we utilize the square and multiply algorithm
    // if the current bit = 0, square and multiply
    // if bit = 1, just square
    let isOne = start.and(bit.equals(false));
    let isZero = start.and(bit.equals(true));

    let square = n.square();
    // we choose what computation to apply next
    n = Circuit.switch([isOne, isZero, start.not()], Field, [
      square,
      square.mul(base),
      n,
    ]);

    // toggle start to accumulate; we only start accumulating once we have reached the first 1
    start = Circuit.if(bit.equals(true).and(start.not()), Bool(true), start);
  }

  return n;
}

function discreteLogRec(a: Field, g: Field, n?: Field): Field {
  n = n ?? Field(1);
  let x = modExp(g, n);
  if (x.equals(a).toBoolean()) return n;
  else return discreteLogRec(a, g, n.add(1));
}

function discreteLog(a: Field, g: Field): Field {
  let n = Field(1);
  let x = modExp(g, n);

  while (!x.equals(a).toBoolean()) {
    n = n.add(1);
    x = modExp(g, n);
  }
  return n;
}

/* function bigIntSqrt(value: bigint, k = 2n) {
  if (value < 0n) {
    throw 'negative number is not supported';
  }

  let o = 0n;
  let x = value;
  let limit = 100n;

  while (x ** k !== k && x !== o && --limit) {
    o = x;
    x = ((k - 1n) * x + value / x ** (k - 1n)) / k;
  }

  return x;
} */

function generateLookup(n = 20000, path = 'lookup.json') {
  let values: Record<string, string> = {};
  for (let i = 0; i < n; i++) {
    let a = modExp(ElGamalFF.G, Field(i));
    values[a.toString()] = i.toString();
  }
  fs.writeFileSync('lookup.json', JSON.stringify(values, undefined, 2));
}

function lookUp(path = 'lookup.json', g: string): string {
  return JSON.parse(fs.readFileSync(path).toString())[g];
}
