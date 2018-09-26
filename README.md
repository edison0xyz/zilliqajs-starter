# zilliqajs-starter
Starter JS Scripts for Zilliqa

## Getting started
1. Run `cp template_config.js config.js`.
2. Update your `config.js` files with your addresses and private key. Addresses should __not__ have `0x` prefix.
  * Correct: `address: 08D419A88BC86E5D84C186A4A7CE21E7DD663685`
  * Wrong: `address: 0x08D419A88BC86E5D84C186A4A7CE21E7DD663685`
3. Run the scripts
    * `node scripts/DeployContract.js`

If you want to test locally, use [KayaRPC](https://github.com/Zilliqa/kaya)

## Configurations

Under the config files, that are some preset settings including privatekey pairs from Kaya RPC's fixture mode.
To test these scripts quickly, run Kaya RPC using `npm run debug:fixtures`. 

