const algosdk = require("algosdk");
require("dotenv").config({ path: "../../.env" });

const assetTransfer = async (assetID, mnemonic, receiver) => {
  const account = algosdk.mnemonicToSecretKey(mnemonic);

  const algodToken =
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const algodServer = "http://localhost";
  const algodPort = "4001";
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  params = await algodClient.getTransactionParams().do();

  //comment out the next two lines to use suggested fee
  // params.fee = 1000;
  // params.flatFee = true;

  const sender = account.addr;
  const recipient = receiver;
  const revocationTarget = undefined;
  const closeRemainderTo = undefined;
  //Amount of the asset to transfer
  const amount = 0;
  const note = undefined;

  // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
  const xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    sender,
    recipient,
    closeRemainderTo,
    revocationTarget,
    amount,
    note,
    assetID,
    params
  );
  // Must be signed by the account sending the asset
  rawSignedTxn = xtxn.signTxn(account.sk);
  let xtx = await algodClient.sendRawTransaction(rawSignedTxn).do();

  // Wait for confirmation
  confirmedTxn = await algosdk.waitForConfirmation(algodClient, xtx.txId, 4);
  //Get the completed Transaction
  console.log(
    "Transaction " +
      xtx.txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );
};

// assetOptin(
//   107962795,
//   "fall confirm bachelor valid cycle amused fly retire rebuild cluster wrestle hurt upgrade like alarm night usual clog tell raise front mixed text able owner"
// );
assetTransfer(
  1,
  "fall confirm bachelor valid cycle amused fly retire rebuild cluster wrestle hurt upgrade like alarm night usual clog tell raise front mixed text able owner",
  "YFOYE3L67F7DCFB27K5OTNIP2KBU2WYFQ73GJFATXFPTNA2UU5UUEPNL6U"
);
// assetOptin(95523752, "6US7FPCF6FFK4NMN3IDBOOLDBV2HJL3AG2D4ZP5OYYUIFM4UQFBMAWYOGQ")

//95523624,95523752
