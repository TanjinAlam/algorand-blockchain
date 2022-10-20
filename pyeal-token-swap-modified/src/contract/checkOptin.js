const algosdk = require("algosdk");

const userMnemonic =
  "panther explain oppose menu digital multiply certain waste conduct salute woman alter ginger snap monster edge window clutch sphere entire mad dial unveil absent inject";

const userAccout = algosdk.mnemonicToSecretKey(userMnemonic);
const sender = userAccout.addr;

const algodToken =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algodServer = "http://localhost";
const algodPort = "4001";
let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
(async function () {
  let accountInfo = await client.accountInformation(sender).do();
  // let optin = await client.accountAssetInformation(sender, 2).do();
  console.log("accountInfo", accountInfo);
  //  await keypress();
})();
