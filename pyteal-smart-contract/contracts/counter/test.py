from pyteal import *
import algosdk



def approval():
   
    escrow_address = Bytes("ESCROW_ADDRESS")
    asa_id = Bytes("ASA_ID")
    asa_price = Bytes("ASA_PRICE")
    asa_owner = Bytes("ASA_OWNER")
    app_state = Bytes("APP_STATE")
    app_admin = Bytes("APP_ADMIN")

    # class AppMethods:
    #     initialize_escrow = "initializeEscrow"
    #     make_sell_offer = "makeSellOffer"
    #     buy = "buy"
    #     stop_sell_offer = "stopSellOffer"
    not_initialized = Int(0)
    active = Int(1)
    selling_in_progress = Int(2)
    # class AppState:
    #     not_initialized = Int(0)
    #     active = Int(1)
    #     selling_in_progress = Int(2)
    

    def app_initialization():
        """
        CreateAppTxn with 2 arguments: asa_owner, app_admin.
        The foreign_assets array should have 1 asa_id which will be the id of the NFT of interest.
        :return:
        """
        return Seq([
            Assert(Txn.application_args.length() == Int(2)),
            App.globalPut(app_state, not_initialized),
            App.globalPut(asa_id, Txn.assets[0]),
            App.globalPut(asa_owner, Txn.application_args[0]),
            App.globalPut(app_admin, Txn.application_args[1]),
            Return(Int(1))
        ])

     


    def clear():
        Approve()

