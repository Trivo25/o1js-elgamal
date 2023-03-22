import {
  Field,
  state,
  State,
  method,
  UInt64,
  PrivateKey,
  SmartContract,
  Mina,
  AccountUpdate,
  isReady,
  Bool,
  PublicKey,
  Circuit,
  shutdown,
} from 'snarkyjs';
import { Cipher, ElGamalFF } from '../elgamal.js';

const doProofs = true;

await isReady;

class SimpleZkapp extends SmartContract {
  @state(Cipher) c1 = State<Cipher>();
  @state(Cipher) c2 = State<Cipher>();
  @state(Cipher) c3 = State<Cipher>();

  @state(Field) result = State<Field>();

  @method encrypt(m1: Field, m2: Field, pk: Field) {
    this.c1.set(ElGamalFF.encrypt(m1, pk));
    this.c2.set(ElGamalFF.encrypt(m2, pk));
  }

  @method multiplyCipher() {
    let c1 = this.c1.get();
    this.c1.assertEquals(c1);

    let c2 = this.c2.get();
    this.c2.assertEquals(c2);

    let c3 = this.c3.get();
    this.c3.assertEquals(c3);

    let product = c1.mul(c2);
    this.c3.set(product);
  }

  @method decrypt(secretKey: Field) {
    let result = this.c3.get();
    this.c3.assertEquals(result);

    let plainText = ElGamalFF.decrypt(result, secretKey);
    this.result.set(plainText);
  }
}
let Local = Mina.LocalBlockchain({ proofsEnabled: doProofs });
Mina.setActiveInstance(Local);

// a test account that pays all the fees, and puts additional funds into the zkapp
let { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0];

// the zkapp account
let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();

let zkapp = new SimpleZkapp(zkappAddress);

let { pk, sk } = ElGamalFF.generateKeys();

let m1 = Field(5);
let m2 = Field(10);

await SimpleZkapp.compile();

console.log('deploy');
let tx = await Mina.transaction(sender, () => {
  AccountUpdate.fundNewAccount(sender);
  zkapp.deploy({ zkappKey });
});
await tx.prove();
await tx.sign([senderKey]).send();

console.log('set and encrypt');
tx = await Mina.transaction(sender, () => {
  zkapp.encrypt(m1, m2, pk);
});
await tx.prove();
await tx.sign([senderKey]).send();

console.log('multiply');
tx = await Mina.transaction(sender, () => {
  zkapp.multiplyCipher();
});
await tx.prove();
await tx.sign([senderKey]).send();

console.log('decrypt');
tx = await Mina.transaction(sender, () => {
  zkapp.decrypt(sk);
});
await tx.prove();
await tx.sign([senderKey]).send();

zkapp.result.get().assertEquals(m1.mul(m2));

shutdown();
