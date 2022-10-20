require('dotenv').config({path: '../../.env'})
const algosdk = require('algosdk');
// const EncodeBytes = require('./utils')
const {APPID} = require("../constants")
const EncodeBytes = require("../utils")

async function contractOptin() {

    try {
      const token =
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const base_server = "http://localhost";
      const port = 4001;
      const algodClient = new algosdk.Algodv2(token, base_server, port);
        let params = await algodClient.getTransactionParams().do();

         const mnemonic =
           "social lava chat sister layer never sunny gospel car beach try zone citizen menu verb alone diet wise blush infant book mind truck absent favorite";
        let deployer_sk = algosdk.mnemonicToSecretKey(mnemonic);
        let deployer_addr = deployer_sk.addr;
        
        let accounts = undefined;
        let foreignApps = undefined;
        let foreignAssets = [1];
        let appID = 2; //update

        let appArgs = [];
        appArgs.push(new Uint8Array(Buffer.from("contract_optin")));
        // appArgs.push(EncodeBytes("contract_optin"));

        
        let callContract = algosdk.makeApplicationNoOpTxn(
            deployer_addr, 
            params, 
            appID, 
            appArgs, 
            accounts, 
            foreignApps, 
            foreignAssets);
        let signedTxn = callContract.signTxn(deployer_sk.sk);
       
        // Submit the transaction
        let tx = (await algodClient.sendRawTransaction(signedTxn).do());

        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
        let transactionResponse = await algodClient.pendingTransactionInformation(tx.txId).do();
        console.log("Called app-id:",transactionResponse['txn']['txn']['apid'])
         //Get the completed Transaction
        console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
        if (transactionResponse['global-state-delta'] !== undefined ) {
            console.log("Global State updated:",transactionResponse['global-state-delta']);
        }
        if (transactionResponse['local-state-delta'] !== undefined ) {
            console.log("Local State updated:",transactionResponse['local-state-delta']);
        }
 
    }
    catch (err) {
        console.log("err", err);
    }
    process.exit();
};

contractOptin();