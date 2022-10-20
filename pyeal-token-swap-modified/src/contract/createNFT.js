// const algosdk = require('algosdk')

// const dotenv = require("dotenv");
// const fs = require("fs");
const algosdk = require("algosdk");
// dotenv.config();
const { getApplicationAddress } = require("algosdk");
//SMART CONTRACT DEPLOYMENT
// declare application state storage (immutable)
const localInts = 0;
const localBytes = 1;
const globalInts = 24; //# 4 for setup + 20 for choices. Use a larger number for more choices.
const globalBytes = 1;

// Connect your client
const algodToken =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = "4001";
let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// (async function () {
//   let accountInfo = await client.accountInformation(sender).do();
//   console.log("accountInfo", accountInfo);
//   //  await keypress();
// })();

const createAsset = async (asset_name, userMnemonic) => {
  const userAccout = algosdk.mnemonicToSecretKey(userMnemonic);
  const sender = userAccout.addr;

  const enc = new TextEncoder();
  const note = enc.encode("Hello World");
  let params = await client.getTransactionParams().do();
  params.fee = 1000;
  params.flatFee = true;
  // let note = undefined;
  let defaultFrozen = false;
  let decimals = 0;
  let total = 1;
  let unitName = "ACT";
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
    unitName,
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
  const tx = await client.sendRawTransaction(signedTxn).do();

  // Wait for confirmation
  let confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);
  //Get the completed Transaction
  console.log(
    "Transaction " +
      txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );

  const transactionResponse = await client
    .pendingTransactionInformation(tx.txId)
    .do();
  console.log(transactionResponse);
  // const appId = transactionResponse["application-index"];
  // console.log("appid", appId)
  // Get App Address
  // let contract_addr = getApplicationAddress(appId);
  // console.log(contract_addr);

  let string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
  console.log("Note field: ", string);
  accountInfo = await client.accountInformation(sender).do();
  console.log("Transaction Amount: %d microAlgos", confirmedTxn.txn.txn.amt);
  console.log("Transaction Fee: %d microAlgos", confirmedTxn.txn.txn.fee);
  console.log("Account balance: %d microAlgos", accountInfo.amount);
};

createAsset(
  "ACT",
  "panther explain oppose menu digital multiply certain waste conduct salute woman alter ginger snap monster edge window clutch sphere entire mad dial unveil absent inject"
);
