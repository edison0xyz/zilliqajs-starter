/*
 * CreateTransaction: This script demonstrates how you can invoke another function within the contract. In this case, we are invoking a transition called `setHello` in the smart contract
 */
require('isomorphic-fetch');
const BN = require('bn.js');
const { Zilliqa } = require('zilliqa-js');
const config = require('../config');
const { argv } = require('yargs');
const url = config.local_url;

const zilliqa = new Zilliqa({
  nodeUrl: url,
});

let privateKey = config.wallet.privateKey;
let contractAddr = config.contract.address;

const address = zilliqa.util.getAddressFromPrivateKey(privateKey);
const node = zilliqa.getNode();
console.log(`Address: ${address}`);

function callback(err, data) {
  if (err || data.error) {
    console.log(err);
  } else {
    console.log(data);
  }
}

/*  MAIN LOGIC  */

console.log('Zilliqa Testing Script');
console.log(`Connected to ${url}`);

/* Contract specific Parameters */

// the immutable initialisation variables
const msg = {
  _tag: 'setHello',
  _amount: '0',
  _sender: `0x${address}`,
  params: [{
    vname: 'msg',
    type: 'String',
    value: 'Howdy!',
  }],
};

// transaction details
const txnDetails = {
  version: 0,
  nonce: 2,
  to: contractAddr,
  amount: new BN(0),
  gasPrice: 1,
  gasLimit: 2000,
  data: JSON.stringify(msg).replace(/\\"/g, '"'),
};

// sign the transaction using util methods
const txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);
console.log(txn);

// send the transaction to the node
node.createTransaction(txn, callback);
