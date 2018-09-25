require('isomorphic-fetch');
const BN = require('bn.js');
const { Zilliqa } = require('zilliqa-js');
const config = require('./config');
const url = config.testurl;

const zilliqa = new Zilliqa({
  nodeUrl: url,
});

let privateKey = config.senderPK;
let recipient = config.wallet.address;

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

// transaction details
const txnDetails = {
  version: 0,
  nonce: 2,
  to: recipient,
  amount: new BN(100000),
  gasPrice: 1,
  gasLimit: 2000,
};

// sign the transaction using util methods
const txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);
console.log(txn);

// send the transaction to the node
node.createTransaction(txn, callback);
