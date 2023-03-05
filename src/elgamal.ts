import { Group, PublicKey, Scalar, PrivateKey, Field } from 'snarkyjs';
import { modExp } from './lib.js';

export { ElGamalECC, ElGamalFF };

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

type CipherText = {
  c1: Field;
  c2: Field;
};

class ElGamalFF {
  private static G = Field(
    '12418654782883325593414442427049395787963493412651469444558597405572177144507'
  );

  static generateKeys(): {
    pk: Field;
    sk: Field;
  } {
    let x = Field.random();

    let h = modExp(this.G, x);

    return {
      pk: h,
      sk: x,
    };
  }

  static encrypt(m: Field, h: Field): CipherText {
    let y = Field.random();

    let s = modExp(h, y);
    let c1 = modExp(this.G, y);
    let c2 = m.mul(s);

    return {
      c1,
      c2,
    };
  }

  static decrypt({ c1, c2 }: CipherText, x: Field) {
    let s = modExp(c1, x);
    let s_ = s.inv();

    let m = c2.mul(s_);
    return m;
  }
}
