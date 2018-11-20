import {BN} from "@zilliqa-js/util";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import * as config from '../config.json';

const zilliqa = new Zilliqa('https://api-scilla.zilliqa.com/');

// Populate the wallet with an account
zilliqa.wallet.addByPrivateKey(config.testAccount.privateKey);

async function testBlockchain() {
    try {
      // Send a transaction to the network
      const tx = await zilliqa.blockchain.createTransaction(
        zilliqa.transactions.new({
          version: 1,
          toAddr: 'affc3236b726660ed9b99dff11451e4e8c107dea',
          amount: new BN(888),
          gasPrice: new BN(1),
          gasLimit: new BN(10),
        }),
      );
      console.log(tx);
  
      // Deploy a contract
      const code = `(* HelloWorld contract *)
  
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
      msg = {_tag : "Main"; _recipient : _sender; _amount : Uint128 0; msg : r};
      msgs = one_msg msg;
      send msgs
  end`;
  
      const init = [
        {
          vname: 'owner',
          type: 'ByStr20',
          value: '0x8254b2c9acdf181d5d6796d63320fbb20d4edd12',
        },
      ];
  
      // instance of class Contract
      const contract = zilliqa.contracts.new(code, init);
  
      const hello = await contract.deploy(new BN(1), new BN(2500));
      const callTx = await hello.call('setHello', [
        {
          vname: 'msg',
          type: 'String',
          value: 'Hello World',
        },
      ]);
      const state = await hello.getState();
      console.log(state);
      console.log(callTx);
    } catch (err) {
      console.log(err);
    }
  }
  
  testBlockchain();