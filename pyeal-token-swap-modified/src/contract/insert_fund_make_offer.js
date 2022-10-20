require('dotenv').config({path: '../../.env'})
const algosdk = require('algosdk');
const {APPID} = require("../constants")
const EncodeBytes = require("../utils")

async function insert_fund_make_offer(assetId,appId, mnemonic) {
  try {
    const token =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const base_server = "http://localhost";
    const port = 4001;
    const algodClient = new algosdk.Algodv2(token, base_server, port);
    let params = await algodClient.getTransactionParams().do();

    
    let deployer_sk = algosdk.mnemonicToSecretKey(mnemonic);
    let deployer_addr = deployer_sk.addr;

    let accounts = undefined;
    let foreignApps = undefined;
    let foreignAssets = undefined;
    let appID = appId; //update
    let appArgs = [];

    appArgs.push(new Uint8Array(Buffer.from("insertFundAndMakeOffer")));
    appArgs.push(new Uint8Array(Buffer.from("100")));
    // appArgs.push(EncodeBytes("contract_optin"));
    let callContract = algosdk.makeApplicationNoOpTxn(
      deployer_addr,
      params,
      appID,
      appArgs,
      accounts,
      foreignApps,
      foreignAssets
    );

    // let signedTxn = callContract.signTxn(deployer_sk.sk);

    let transferASA = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(
      {
        from: deployer_addr,
        suggestedParams: params,
        to: "WI7XTCTK42LLU6XD5AWB6L5Q2JF3F2SYI2HMMQD65YMQAATOB75KGAE7PQ",
        closeRemainderTo: undefined,
        revocationTarget: undefined,
        amount: 1,
        assetIndex: assetId,
      }
    );

    const atomictxn = [transferASA, callContract];
    algosdk.assignGroupID(atomictxn);
    // console.log("asdasdas", txgroup);
    const signedTxn1 = transferASA.signTxn(deployer_sk.sk);
    const signedTxn2 = callContract.signTxn(deployer_sk.sk);

    let signed = [];
    signed.push(signedTxn1);
    signed.push(signedTxn2);

    // Submit the transaction
    let tx = await algodClient.sendRawTransaction(signed).do();

    let confirmedTxn = await algosdk.waitForConfirmation(
      algodClient,
      tx.txId,
      4
    );
    let transactionResponse = await algodClient
      .pendingTransactionInformation(tx.txId)
      .do();
    console.log("Called app-id:", transactionResponse["txn"]["txn"]["apid"]);
    //Get the completed Transaction
    console.log(
      "Transaction " +
        tx.txId +
        " confirmed in round " +
        confirmedTxn["confirmed-round"]
    );
    //Get the completed Transaction
    // console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    // if (transactionResponse['global-state-delta'] !== undefined ) {
    //     console.log("Global State updated:",transactionResponse['global-state-delta']);
    // }
    // if (transactionResponse['local-state-delta'] !== undefined ) {
    //     console.log("Local State updated:",transactionResponse['local-state-delta']);
    // }
  } catch (err) {
    console.log("err", err);
  }
  process.exit();
};
let assetId = 12;
let appId = 13;
let mnemonic =
  "panther explain oppose menu digital multiply certain waste conduct salute woman alter ginger snap monster edge window clutch sphere entire mad dial unveil absent inject";
insert_fund_make_offer(assetId, appId, mnemonic);