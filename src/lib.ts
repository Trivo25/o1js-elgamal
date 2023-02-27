import { Bool, Circuit, Field } from 'snarkyjs';

export { modExp };

function modExp(base: Field, exponent: Field) {
  let bits = exponent.toBits();
  let n = base;

  // this keeps track of when we can start accumulating
  let start = Bool(false);

  // we have to go in reverse order here because .toBits returns bits in LSB representation
  for (let i = 254; i >= 0; i--) {
    let bit = bits[i];

    // we utilize the square and multiply algorithm
    // if the current bit = 0,
    let isOne = start.and(bit.equals(Bool(false)));
    let isZero = start.and(bit.equals(Bool(true)));

    // we choose what computation to apply next
    n = Circuit.switch([isOne, isZero, start.not()], Field, [
      n.square(),
      n.square().mul(base),
      n,
    ]);

    //
    start = Circuit.if(
      bit.equals(Bool(true)).and(start.not()),
      Bool(true),
      start
    );
  }

  return n;
}
