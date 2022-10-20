import { Wallet } from 'algorand-session-wallet';
import algosdk, {Algodv2, makeAssetCreateTxnWithSuggestedParamsFromObject} from 'algosdk'
import { NFT, Token } from './nft';
import { Metadata } from './metadata'
import { conf } from './config'

function getClient(activeConf: number): Algodv2 {
  const ac = conf[activeConf]
  const token = ac.algodToken?ac.algodToken:""
  const host = ac.algod?ac.algod:""
  const port = ac.algodPort?ac.algodPort:0
  return new algosdk.Algodv2(token, host, port)
}

function setOrUndef(addr: string): string | undefined {
  return addr===""?undefined:addr
}

export async function createToken(wallet: Wallet, activeConf: number, token: Token, md: Metadata): Promise<number> {
    const addr      = wallet.getDefaultAccount()
    const suggested = await getSuggested(activeConf, 100)

    const create_txn =  makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: addr,
        assetName: md.name,
        unitName: md.unitName,
        assetURL: token.url,
        assetMetadataHash: md.toHash(),
        manager: setOrUndef(token.manager),
        reserve: setOrUndef(token.reserve),
        clawback: setOrUndef(token.clawback),
        freeze: setOrUndef(token.freeze),
        total: Math.pow(10, token.decimals),
        decimals: token.decimals,
        defaultFrozen: token.defaultFrozen,
        suggestedParams: suggested
    })

    const [create_txn_s]  = await wallet.signTxn([create_txn])

    const result = await sendWait(activeConf, [create_txn_s])
    return result['asset-index']
}

export async function getSuggested(activeConf: number, rounds: number) {
    const txParams = await getClient(activeConf).getTransactionParams().do();
    return { ...txParams, lastRound: txParams['firstRound'] + rounds }
}

export async function getToken(activeConf: number, assetId: number): Promise<any> {
  return await getClient(activeConf).getAssetByID(assetId).do()
}

export async function getCollection(activeConf: number, address: string): Promise<any[]> {
  const results = await getClient(activeConf).accountInformation(address).do()

  const plist = []
  for(const a in results['assets']){
    if(results['assets'][a]['amount']>0)
      plist.push(getToken(activeConf, results['assets'][a]['asset-id']))
  }

  console.log(results)
  console.log(plist)

  const assets = await Promise.all(plist)
  const collectionRequests = assets.map((a)=>{ return NFT.fromToken(activeConf, a) })
  return Promise.all(collectionRequests)
}

export async function sendWait(activeConf: number, signed: any[]): Promise<any> {
    const client = getClient(activeConf)
    try {
        const {txId} = await client.sendRawTransaction(signed.map((t)=>{return t.blob})).do()
        const result = await algosdk.waitForConfirmation(client, txId, 3)
        return result 
    } catch (error) { 
        console.error(error)
    }

    return undefined 
}