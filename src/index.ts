import {
  Group,
  PublicKey,
  Scalar,
  PrivateKey,
  shutdown,
  Field,
  Bool,
  Circuit,
  isReady,
} from 'snarkyjs';

export { ElGamalECC };

class ElGamalECC {
  private static G = Group.generator;

  static encrypt(msg: Group, y: PublicKey) {
    let k = Scalar.random();
    return {
      c: this.G.scale(k),
      d: y.toGroup().scale(k).add(msg),
    };
  }

  static decrypt({ c, d }: { c: Group; d: Group }, priv: PrivateKey) {
    let x = priv.s;
    let c_ = c.scale(x);
    let pm = d.sub(c_);
    return pm;
  }
}
await isReady;

function modExp(base: Field, exponent: Field) {
  let bits = exponent.toBits();
  let n = base;
  let foundFist = Bool(false);

  for (let i = 254; i >= 0; i--) {
    let bit = bits[i];

    let addSquare = foundFist.and(bit.equals(Bool(false)));
    let addSquareMul = foundFist.and(bit.equals(Bool(true)));

    n = Circuit.switch(
      [addSquare, addSquareMul, addSquare.not().and(addSquareMul.not())],
      Field,
      [n.square(), n.square().mul(base), n]
    );

    foundFist = Circuit.if(
      bit.equals(Bool(true)).and(foundFist.not()),
      Bool(true),
      foundFist
    );
  }

  return n;
}

let x = modExp(Field(35), Field(5));
console.log(x.toString());
shutdown();
