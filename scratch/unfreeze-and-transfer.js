
const TronWeb = require('../dist/TronWeb.node.js')

SHASTA_API = 'https://api.shasta.trongrid.io';
MAINNET_API = 'https://api.trongrid.io';

/////////////////////////////// CHANGE THESE VALUES /////////////////////////////////////////
CURRENT_API = SHASTA_API
//CURRENT_API = MAINNET_API
const PRIVATE_KEY = 'F84D52ADBAA82BEB2A48C14BC09D51DE2A2BEED620F17054CAA013312838B4DB';
const NEW_ADDRESS = 'TSMM53DyV9tW3jVGwKfukGS8YbaiRG17EQ';
/////////////////////////////////////////////////////////////////////////////////////////////

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(CURRENT_API);
const solidityNode = new HttpProvider(CURRENT_API);
const eventServer = CURRENT_API;

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    PRIVATE_KEY
)

App = {

     Freeze_js : async function(){

        const currentaddress = await tronWeb.address.fromHex((((await tronWeb.trx.getAccount()).address).toString()));
        console.log("currentaddress", currentaddress);

        const addressbalance = await tronWeb.trx.getBalance(currentaddress);
        console.log('---------------------------')
        console.log("addressbalance", addressbalance);
        const freezetransaction = await tronWeb.transactionBuilder.freezeBalance(tronWeb.toSun(100), 3, "BANDWIDTH");
        console.log('---------------------------')
        console.log("freezetransaction", freezetransaction);

        const signedfreezetransaction = await tronWeb.trx.sign(freezetransaction);
        console.log('---------------------------')
        console.log("signedfreezetransaction", signedfreezetransaction);

     },

    UnfreezeAndTransfer_js : async function(){

        const currentaddressunfreeze = tronWeb.address.fromHex((((await tronWeb.trx.getAccount()).address).toString()));
        const currentaddressbalance = (await tronWeb.trx.getAccount()).balance;
        console.log("currentaddressbalance", currentaddressbalance);

        while (true) {

            try{

                const unfreeze = await tronWeb.transactionBuilder.unfreezeBalance("BANDWIDTH", currentaddressunfreeze);

                console.log("unfreeze", unfreeze);

                const signedunfreeze = await tronWeb.trx.sign(unfreeze, PRIVATE_KEY);
                console.log("signedunfreeze", signedunfreeze);
                tronWeb.trx.sendRawTransaction(signedunfreeze);

            }catch(err){
                console.log('-----*****************-----')
                console.log("Unfreeze Error : ", err);
                console.log('It is not the time to unfreeze yet!')
                console.log('-----*****************-----')

            }


            try{
                    const transfer = await tronWeb.transactionBuilder.sendTrx(NEW_ADDRESS, currentaddressbalance, currentaddressunfreeze);
                    //const transfer = await tronWeb.transactionBuilder.sendTrx(NEW_ADDRESS, (currentaddressbalance/10), currentaddressunfreeze);         //*********CHANGE IT!!!!!!!!!!*****************//

                    const signedtransfer = await tronWeb.trx.sign(transfer, PRIVATE_KEY);
                    console.log("signedtransfer", signedtransfer);
                    tronWeb.trx.sendRawTransaction(signedtransfer);
                }catch(err){
                console.log('-----*****************-----')
                console.log("Transfer Error : ", err);
                console.log('Account Balance is insufficient!')
                console.log('-----*****************-----')

                }
        }

    }

}

////////////////////////////////////////////////////////////////////
//App.Freeze_js().then(console.log)
App.UnfreezeAndTransfer_js().then(console.log)
////////////////////////////////////////////////////////////////////

