// const algosdk = require('algosdk')

// const dotenv = require("dotenv");
// const fs = require("fs");
const algosdk = require("algosdk");
// dotenv.config();

//SMART CONTRACT DEPLOYMENT
// declare application state storage (immutable)
const localInts = 0;
const localBytes = 1;
const globalInts = 24; //# 4 for setup + 20 for choices. Use a larger number for more choices.
const globalBytes = 1;

// // get accounts from mnemonic
const creatorMnemonic =
  "ticket turkey horn swarm stomach abstract fix allow chief jar cream rain oven vivid bubble essay later model mystery frozen afford grit salad able uncle";
const userMnemonic =
  "team clean family plunge head idea screen priority area curious typical drift flat cloth jump truth tobacco blade nuclear lady dose faculty rice absorb modify";
const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);
const userAccout = algosdk.mnemonicToSecretKey(userMnemonic);
const sender = userAccout.addr;
// const sender = creatorAddress.addr;
console.log("sese", sender.length);
console.log("sese", typeof sender);
console.log("sese", typeof sender !== "string");

console.log();
// Connect your client
const algodToken =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = "4001";
let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
(async function () {
  let accountInfo = await client.accountInformation(sender).do();
  console.log("accountInfo", accountInfo);
  //  await keypress();
})();

const createAsset = async (asset_name, unit_name) => {
  const enc = new TextEncoder();
  const note = enc.encode("Hello World");
  let params = await client.getTransactionParams().do();
  params.fee = 1000;
  params.flatFee = true;
  console.log(params);
  // let note = undefined;
  let creator = sender;
  let defaultFrozen = false;
  let decimals = 8;
  let total = 100000000000000;
  let unitName = unit_name;
  let assetName = asset_name;
  let assetURL = "google.com";
  //  Optional hash commitment of some sort relating to the asset. 32 character length.
  let assetMetadataHash = undefined;
  let manager = sender;
  let reserve = sender;
  let freeze = sender;
  let clawback = sender;
  // signing and sending "txn" allows "addr" to create an asset
  let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
    sender,
    note,
    total,
    decimals,
    defaultFrozen,
    manager,
    reserve,
    freeze,
    clawback,
    unitName,
    unit_name,
    assetName,
    assetMetadataHash,
    params
  );
  // sender,
  // params.fee,
  // note,
  // total,
  // decimals,
  // defaultFrozen,
  // manager,
  // reserve,
  // freeze,
  // clawback,
  // unitName,
  // assetName,
  // assetURL,
  // assetMetadataHash,
  // params
  // Sign the transaction
  let signedTxn = txn.signTxn(userAccout.sk);
  let txId = txn.txID().toString();
  console.log("Signed transaction with txID: %s", txId);

  // Submit the transaction
  await client.sendRawTransaction(signedTxn).do();

  // Wait for confirmation
  let confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);
  //Get the completed Transaction
  console.log(
    "Transaction " +
      txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );
  let string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
  console.log("Note field: ", string);
  accountInfo = await client.accountInformation(sender).do();
  console.log("Transaction Amount: %d microAlgos", confirmedTxn.txn.txn.amt);
  console.log("Transaction Fee: %d microAlgos", confirmedTxn.txn.txn.fee);
  console.log("Account balance: %d microAlgos", accountInfo.amount);
};

createAsset("ACT", "ACT");
