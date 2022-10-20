const algosdk = require("algosdk");
require("dotenv").config({ path: "../../.env" });

const algodToken =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = "4001";
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const account = algosdk.mnemonicToSecretKey(
  "social lava chat sister layer never sunny gospel car beach try zone citizen menu verb alone diet wise blush infant book mind truck absent favorite"
);

const assetOptin = async (assetID, receiver) => {
  params = await algodClient.getTransactionParams().do();
  //comment out the next two lines to use suggested fee
  // params.fee = 1000;
  // params.flatFee = true;

  const sender = account.addr;
  const recipient = receiver;
  const revocationTarget = undefined;
  const closeRemainderTo = undefined;
  //Amount of the asset to transfer
  const amount = 10000;
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
  txn = xtxn.ApplicationOptInTxn(sender, params, index);
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

//OPTIN
// create unsigned transaction
const Optin = async (mnemonic, foreignAppsId) => {
  try {
    const algodToken =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const algodServer = "http://localhost";
    const algodPort = "4001";
    const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    const userAccout = algosdk.mnemonicToSecretKey(mnemonic);
    console.log("userAccout", userAccout);
    let params = await client.getTransactionParams().do();
    params.fee = 10000;
    params.flatFee = true;

    // let txn = algosdk.makeApplicationOptInTxn(
    //   userAccout.addr,
    //   params,
    //   foreignAppsId
    // );
    let txn = algosdk.makeApplicationOptInTxnFromObject({
      from: userAccout.addr,
      suggestedParams: params,
      appIndex: foreignAppsId,
    });
    let txId = txn.txID().toString();
    // sign, send, await
    // Sign the transaction
    let signedTxn = txn.signTxn(userAccout.sk);
    console.log("Signed transaction with txID: %s", txId);

    // Submit the transaction
    await client.sendRawTransaction(signedTxn).do();
    // Wait for transaction to be confirmed
    const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);
    console.log("confirmed" + confirmedTxn);

    // //Get the completed Transaction
    // console.log(
    //   "Transaction " +
    //     txId +
    //     " confirmed in round " +
    //     confirmedTxn["confirmed-round"]
    // );
    // // display results
    // // display results
    // let transactionResponse = await client
    //   .pendingTransactionInformation(txId)
    //   .do();
    // console.log(
    //   "Opted-in to app-id:",
    //   transactionResponse["txn"]["txn"]["apid"]
    // );
  } catch (err) {
    console.log(err);
  }
};

Optin(
  "mind cube deputy stereo solid useful carpet link tent acid cruel velvet aerobic common jazz embark slow valve anchor quiz coast pumpkin cake absorb awkward",
  [108379279]
);
// assetOptin(2, "GV473MAAQX2IN3FWWIG656LSSDJ3EJEGJOIN7R43YT3YOEGWAMMNKDNBNA");
// assetOptin(2, "LMTOYRT2WPSUY6JTCW2URER6YN3GETJ5FHTQBA55EVK66JG2QOB32WPIHY");
// assetOptin(95523752, "6US7FPCF6FFK4NMN3IDBOOLDBV2HJL3AG2D4ZP5OYYUIFM4UQFBMAWYOGQ")

//95523624,95523752
