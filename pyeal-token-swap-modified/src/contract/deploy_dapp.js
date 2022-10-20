require("dotenv").config({ path: "../../.env" });
const algosdk = require("algosdk");
const { getApplicationAddress } = require("algosdk");
const fs = require("fs");

async function compileProgram(algodClient, programSource) {
  const file = fs.readFileSync(programSource, "utf8");
  const compile = await algodClient.compile(file).do();
  const compiledBytes = new Uint8Array(Buffer.from(compile.result, "base64"));
  return compiledBytes;
}

async function deployApp(assetId, mnemonic, asa_owner) {
  try {
    const algodToken =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const base_server = "http://localhost";
    const port = 4001;
    const algodClient = new algosdk.Algodv2(algodToken, base_server, port);
    const params = await algodClient.getTransactionParams().do();

    const deployer_sk = algosdk.mnemonicToSecretKey(mnemonic);
    const deployer_addr = deployer_sk.addr;

    const approvalProgram = await compileProgram(
      algodClient,
      "./approval.teal"
    );
    const clearProgram = await compileProgram(algodClient, "./clear.teal");

    const onComplete = algosdk.OnApplicationComplete.NoOpOC;

    const localInts = 0;
    const localBytes = 0;
    const globalInts = 8;
    const globalBytes = 8;

    const accounts = undefined;
    const foreignApps = undefined;
    const foreignAssets = [Number(assetId)]; //First value is wNGN token & Second is wGHC for testing purposes..

    const appArgs = [];

    appArgs.push(new Uint8Array(Buffer.from(asa_owner))); //Setting owner
    appArgs.push(new Uint8Array(Buffer.from(asa_owner))); //Setting admin
    const createApp = algosdk.makeApplicationCreateTxn(
      deployer_addr,
      params,
      onComplete,
      approvalProgram,
      clearProgram,
      localInts,
      localBytes,
      globalInts,
      globalBytes,
      appArgs,
      accounts,
      foreignApps,
      foreignAssets
    );

    const signedTxn = createApp.signTxn(deployer_sk.sk);

    // Submit the transaction
    const tx = await algodClient.sendRawTransaction(signedTxn).do();

    const confirmedTxn = await algosdk.waitForConfirmation(
      algodClient,
      tx.txId,
      4
    );
    const transactionResponse = await algodClient
      .pendingTransactionInformation(tx.txId)
      .do();
    const appId = transactionResponse["application-index"];

    // Get App Address
    let contract_addr = getApplicationAddress(appId);
    console.log(contract_addr);

    //Get the completed Transaction
    console.log(
      "Transaction " +
        tx.txId +
        " confirmed in round " +
        confirmedTxn["confirmed-round"]
    );
    console.log("The application ID is: " + appId);
  } catch (err) {
    console.log("err", err);
  }
  process.exit();
}
deployApp(
  12,
  "panther explain oppose menu digital multiply certain waste conduct salute woman alter ginger snap monster edge window clutch sphere entire mad dial unveil absent inject",
  "TN5ZDZMC25MGAPGZN4MBMJ2R7BOW3KOJQ733OKEY57JVMALYC3CW4VEASA"
);
