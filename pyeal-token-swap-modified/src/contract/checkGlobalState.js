const algosdk = require("algosdk");

const algodToken =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = "4001";
let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

/**
 * @description Used to read global state of the application
 * @async
 * @param {Object} client Constructor for connecting to test environment
 * @param {String} account Wallet SK obtained from mnemonic
 * @param {Number} index Number identifier for application
 */
async function readGlobalState(client, mnemonic, index) {
  const userAccout = algosdk.mnemonicToSecretKey(mnemonic);
  let account = userAccout.sk;

  let accountInfoResponse = await client
    .accountInformation(userAccout.addr)
    .do();
  // console.log("accountInfoResponse", accountInfoResponse);

  for (let i = 0; i < accountInfoResponse["created-apps"].length; i++) {
    if (accountInfoResponse["created-apps"][i].id == index) {
      console.log("Application's global state:");
      for (
        let n = 0;
        n <
        accountInfoResponse["created-apps"][i]["params"]["global-state"].length;
        n++
      ) {
        console.log(
          accountInfoResponse["created-apps"][i]["params"]["global-state"][n]
        );
        console.log(
          Buffer.from(
            accountInfoResponse["created-apps"][i]["params"]["global-state"][n]
              .value.bytes,
            "base64"
          ).toString()
        );
      }
    }
  }
}
let appId = 14;
let mnemonic =
  "panther explain oppose menu digital multiply certain waste conduct salute woman alter ginger snap monster edge window clutch sphere entire mad dial unveil absent inject";
readGlobalState(client, mnemonic, appId);

// const userAccout = algosdk.mnemonicToSecretKey(mnemonic);
// (async function () {
//   let accountInfo = await client.accountInformation(userAccout.addr).do();
//   // let optin = await client.accountAssetInformation(sender, 2).do();
//   console.log("accountInfo", accountInfo);
//   //  await keypress();
// })();
