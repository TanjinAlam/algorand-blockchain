require("dotenv").config({ path: "../../.env" });
const algosdk = require("algosdk");
const { APPID, CONTRACT_ADDRESS } = require("../constants");
const EncodeBytes = require("../utils");

async function Swap(assetId, foreignAssedId, tokenArg) {
  try {
    const algodToken =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const algodServer = "http://localhost";
    const algodPort = "4001";
    const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    const params = await algodClient.getTransactionParams().do();

    const mnemonicReceiver =
      "brown spice kiwi pudding walk eight draw suggest input boost toilet dance project vital myth smoke can congress throw canoe skate invite force abandon memory";
    const mnemonic =
      "team clean family plunge head idea screen priority area curious typical drift flat cloth jump truth tobacco blade nuclear lady dose faculty rice absorb modify";
    const user_sk = algosdk.mnemonicToSecretKey(mnemonic);
    const user_addr = user_sk.addr;

    const receiverWall = algosdk.mnemonicToSecretKey(mnemonicReceiver);
    const reciver = receiverWall.addr;
    console.log("reciverreciver", reciver);
    const accounts = [reciver];
    const foreignApps = [2];
    const foreignAssets = [1];
    const closeRemainderTo = undefined;
    const revocationTarget = undefined;
    const note = undefined;
    const amount = 100000000000;

    const appArgs = [];
    appArgs.push(new Uint8Array(Buffer.from(tokenArg)));
    appArgs.push(algosdk.encodeUint64(100000000000));
    
    let transferASA = algosdk.makeAssetTransferTxnWithSuggestedParams(
      user_addr,
      reciver,
      closeRemainderTo,
      revocationTarget,
      amount,
      note,
      1,
      params
    );
    
    let callContract = algosdk.makeApplicationNoOpTxnFromObject({
      from: user_addr,
      suggestedParams: params,
      appIndex: 2,
      appArgs: appArgs,
      accounts: undefined,
      foreignAssets: [1],
    });

    console.log("callContract", callContract);
    const atomictxn = [transferASA, callContract];
    algosdk.assignGroupID(atomictxn);
    // console.log("asdasdas", txgroup);
    const signedTxn1 = transferASA.signTxn(user_sk.sk);
    const signedTxn2 = callContract.signTxn(user_sk.sk);

    let signed = [];
    signed.push(signedTxn1);
    signed.push(signedTxn2);

    // Submit the transaction
    const tx = await algodClient.sendRawTransaction(signed).do();

    const confirmedTxn = await algosdk.waitForConfirmation(
      algodClient,
      tx.txId,
      4
    );
    const transactionResponse = await algodClient
      .pendingTransactionInformation(tx.txId)
      .do();
    const appId = transactionResponse["application-index"];

    //Get the completed Transaction
    console.log(
      "Transaction " +
        tx.txId +
        " confirmed in round " +
        confirmedTxn["confirmed-round"]
    );
  } catch (err) {
    console.log("err", err);
  }
  process.exit();
}

//Swap wNGN
Swap(1, 1, "withdraw");
// Swap wGHC
// await Swap(95523752,95523624, "wGHC")
