/* Simple test script */

import { Zilliqa } from '@zilliqa-js/zilliqa';
import * as zutils from '@zilliqa-js/util';
import config from '../config.json';

const zilliqa = new Zilliqa('http://localhost:4200');

// Populate the wallet with an account
zilliqa.wallet.addByPrivateKey(config.testAccount.privateKey);

// Gets the wallet information
console.log(zilliqa.wallet);

// Checks if a given address is an address
console.log('Validation classes');
console.log(zutils.validation.isAddress('c5a829596fb06a59e2b1ddb6589811c759025d52'));

async function SimpleDemo() {

    const gasRequired = await zilliqa.blockchain.getMinimumGasPrice();
    console.log(`Minimum Gas Required: : ${gasRequired.result}`);

    const getTxRate = await zilliqa.blockchain.getTransactionRate();
    console.log(`Current TPS: ${getTxRate.result}`);

    // Getting a certain TX block
    const getTxInfo = await zilliqa.blockchain.getTxBlock(1);
    console.log(getTxInfo);

    // Parse unix timestamp: Note - remember to check for undefined errors!
    console.log(`Timestamp of Tx Block 1`);
    const unixTimestamp = parseInt(getTxInfo.result.header.Timestamp)/1000;
    console.log(new Date(unixTimestamp).toLocaleDateString("en-US"))
    console.log(new Date(unixTimestamp).toLocaleTimeString("en-US"))


}

SimpleDemo();






