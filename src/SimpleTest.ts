/* Simple test script */

import { Zilliqa } from '@zilliqa-js/zilliqa';
import * as zutils from '@zilliqa-js/util';
import config from '../config.json';

const zilliqa = new Zilliqa('https://api.zilliqa.com/');

// Populate the wallet with an account
zilliqa.wallet.addByPrivateKey(config.testAccount.privateKey);

// Gets the wallet information
console.log(zilliqa.wallet);

// Checks if a given address is an address
console.log('Validation classes');
console.log(zutils.validation.isAddress('c5a829596fb06a59e2b1ddb6589811c759025d52'));



