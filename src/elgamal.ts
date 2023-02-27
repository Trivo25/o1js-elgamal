import { Group, PublicKey, Scalar, PrivateKey } from 'snarkyjs';

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
