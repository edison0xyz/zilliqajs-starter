import { BN, Long } from '@zilliqa-js/util';
import { Zilliqa } from '@zilliqa-js/zilliqa';
import * as CP from '@zilliqa-js/crypto';

const zilliqa = new Zilliqa('http://localhost:4200');

//Populate the wallet with an account
const privkey = 'db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3';

zilliqa.wallet.addByPrivateKey(
  privkey
);

const add = CP.getAddressFromPrivateKey(privkey);
console.log('Your account address is:');
console.log(`0x${add}`);

async function testBlockchain() {
  try {
    //GetBalance
    const balance = await zilliqa.blockchain.getBalance(add);
    console.log('Your account balance is:');
    console.log(balance.result);

    //Send a transaction to the network
    const tx = await zilliqa.blockchain.createTransaction(
      zilliqa.transactions.new({
        version: 1,
        toAddr: '573EC96638C8BB1C386394602E1460634F02ADDA',
        amount: new BN(888888),
        gasPrice: new BN(1000000000),
        gasLimit: Long.fromNumber(1),
      }),
    );
    console.log("The transaction status is:");
    // @ts-ignore
    console.log(tx.receipt);

    //Deploy a contract
    const code = `scilla_version 0

    (* HelloWorld contract *)

    import ListUtils

    (***************************************************)
    (*               Associated library                *)
    (***************************************************)
    library HelloWorld

    let one_msg =
      fun (msg : Message) =>
      let nil_msg = Nil {Message} in
      Cons {Message} msg nil_msg

    let not_owner_code = Int32 1
    let set_hello_code = Int32 2

    (***************************************************)
    (*             The contract definition             *)
    (***************************************************)

    contract HelloWorld
    (owner: ByStr20)

    field welcome_msg : String = ""

    transition setHello (msg : String)
      is_owner = builtin eq owner _sender;
      match is_owner with
      | False =>
        msg = {_tag : "Main"; _recipient : _sender; _amount : Uint128 0; code : not_owner_code};
        msgs = one_msg msg;
        send msgs
      | True =>
        welcome_msg := msg;
        msg = {_tag : "Main"; _recipient : _sender; _amount : Uint128 0; code : set_hello_code};
        msgs = one_msg msg;
        send msgs
      end
    end


    transition getHello ()
        r <- welcome_msg;
        e = {_eventname: "getHello()"; msg: r};
        event e
    end`;

    const init = [
      // this parameter is mandatory for all init arrays
      {
        vname : '_scilla_version',
        type : 'Uint32',
        value : '0',
      },
      {
        vname: 'owner',
        type: 'ByStr20',
        // NOTE: all byte strings passed to Scilla contracts _must_ be
        // prefixed with 0x. Failure to do so will result in the network
        // rejecting the transaction while consuming gas!
        value: `0x${add}`,
      },
    ];

    // Instance of class Contract
    const contract = zilliqa.contracts.new(code, init);

    // Deploy the contract
    const [deployTx, hello] = await contract.deploy({
      version: 1,
      gasPrice: new BN(1000000000),
      gasLimit: Long.fromNumber(2500),
    });

    // Introspect the state of the underlying transaction
    console.log('Deployment Transaction ID: ', deployTx.id);
    console.log('Deployment Transaction Receipt: ', deployTx.txParams.receipt);

    // Get the deployed contract address
    console.log('The contract address is:');
    console.log(hello.address);
    const callTx = await hello.call('setHello', [
      {
        vname: 'msg',
        type: 'String',
        value: 'Hello World'
      }],
      {
        // amount, gasPrice and gasLimit must be explicitly provided
        version: 1,
        amount: new BN(0),
        gasPrice: new BN(1000000000),
        gasLimit: Long.fromNumber(2500),
      }
    );
    console.log(callTx);

    //Get the contract state
    const state = await hello.getState();
    console.log('The state of the contract is:');
    console.log(state);
  } catch (err) {
    console.log(err);
  }
}

testBlockchain();
