from pyteal import *
from pyteal.ast.bytes import Bytes


def approval():
    # local variable for each users
    asa_id = Bytes("ASA_ID")
    asa_price = Bytes("ASA_PRICE")
    asa_owner = Bytes("ASA_OWNER")
    app_state = Bytes("APP_STATE")
    app_admin = Bytes("APP_ADMIN")

    on_create = Seq([
        Assert(Txn.application_args.length() == Int(2)),#First one is application call
        App.globalPut(asa_id, Txn.assets[0]), #Store NFT AssetID
        App.globalPut(app_state, Int(0)),#Set current app state is inactive
        App.globalPut(asa_owner, Txn.application_args[0]),#currrent Owner
        App.globalPut(app_admin, Txn.application_args[1]),#app Admin
        Return(Int(1))
        # App.globalPut(Bytes("Creator"), Txn.sender()), #Setting Creator == msg.sender()
        # App.globalPut(Bytes("ACT"), Txn.assets[0]), # Creating ACT variable and assigning assetId of index 0
    ])

    # Contract optin with nft 
    def optin_with_asc(amount, receiver):
        return Seq([
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.asset_receiver: receiver,
                TxnField.asset_amount: amount,
                TxnField.xfer_asset: App.globalGet(asa_id), 
            }),
            InnerTxnBuilder.Submit(),
        ])
    # Asset Transfer
    # def transfer_nft(amount, receiver):
    #     return Seq([
    #         InnerTxnBuilder.Begin(),
    #         InnerTxnBuilder.SetFields({
    #             TxnField.type_enum: TxnType.AssetTransfer,
    #             TxnField.asset_receiver: receiver,
    #             TxnField.asset_amount: amount,
    #             TxnField.xfer_asset: App.globalGet(asa_id), #ON CALL asset index 0 = ACT
    #         }),
    #         InnerTxnBuilder.Submit(),
    #     ])
    

    insert_fund_and_mkf = Seq([
        Assert(Txn.sender() == App.globalGet(asa_owner)), #Ensures only creator can make this call
        Assert(Global.group_size() == Int(2)),
        # optin_with_asc(Int(0), Global.current_application_address()),#contract optin with the nft
        Assert(Gtxn[1].receiver() == Global.current_application_address()), #Send the nft to this smart contract
        Assert(Gtxn[1].assets[0] == App.globalGet(asa_id)), #Make sure the asset is pre-defiend
        App.globalPut(asa_price, Btoi(Txn.application_args[1])), #set NFT price
        App.globalPut(app_state, Int(1)),#set app state is selling
        Approve(),
    ]) 

    

    def stop_sell_offer():
        """
        Single application call.
        :return:
        """
        valid_number_of_transactions = Global.group_size() == Int(1)
        valid_caller = Txn.sender() == App.globalGet(asa_owner)#only asa owner can stop sell offer
        app_is_initialized = App.globalGet(app_state) == Int(1)

        can_stop_selling = And(valid_number_of_transactions,
                               valid_caller,
                               app_is_initialized)

        update_state = Seq([
            App.globalPut(app_state,Int(0)),
            Return(Int(1))
        ])

        return If(can_stop_selling).Then(update_state).Else(Return(Int(0)))



    def make_sell_offer():
        """
        Single application call with 2 arguments.
        - method_name
        - price
        :return:
        """
        valid_number_of_transactions = Global.group_size() == Int(1)
        app_is_active = (App.globalGet(app_state) == Int(1)) 
        valid_caller = Txn.sender() == App.globalGet(asa_owner)#Only asa owner can make new sell offer
        valid_number_of_arguments = Txn.application_args.length() == Int(2)

        can_sell = And(valid_number_of_transactions,
                       app_is_active,
                       valid_number_of_arguments,
                       valid_caller)

        update_state = Seq([
            App.globalPut(asa_price, Btoi(Txn.application_args[1])), #set NFT price
            App.globalPut(app_state, Int(1)),#set app state is selling
            Return(Int(1))
        ])

        return If(can_sell).Then(update_state).Else(Return(Int(0)))
    # Asset Transfer
    def send_asset_to_owner():
        return Seq([
            #First one is application call
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.asset_receiver: Gtxn[0].accounts[0],
                TxnField.asset_amount: Int(1),
                TxnField.xfer_asset: App.globalGet(asa_id), 
            }),
            InnerTxnBuilder.Submit(),
        ])

 
    withdraw_asset = Seq([
        Assert(Txn.sender() == App.globalGet(asa_owner)), #Ensures only creator can make this call
        Assert(App.globalGet(app_state) == Int(0)),
        send_asset_to_owner(),
        Approve(),
    ]) 


    def buy():
        valid_number_of_transactions = Global.group_size() == Int(3)
        asa_is_on_sale = App.globalGet(app_state) == Int(1)



        valid_payment_to_seller = And(  #Validate 
            Gtxn[1].type_enum() == TxnType.Payment,
            Gtxn[1].receiver() == App.globalGet(asa_owner),
            Gtxn[1].amount() == App.globalGet(asa_price),
        )

        can_buy = And(valid_number_of_transactions,
                      asa_is_on_sale,
                      valid_payment_to_seller)

        update_state = Seq([
            App.globalPut(asa_owner, Gtxn[0].sender()),
            App.globalPut(app_state, Int(0)),
            Return(Int(1))
        ])

        return If(can_buy).Then(update_state).Else(Return(Int(0)))


    #Switch cases for all noOp call's
    on_call = Cond(
        [Txn.application_args[0] == Bytes("makeSellOffer"), make_sell_offer()],
        [Txn.application_args[0] == Bytes("stopSellOffer"), stop_sell_offer()],
        [Txn.application_args[0] == Bytes("sendNftToASC"), insert_fund_and_mkf],
        [Txn.application_args[0] == Bytes("contract_optin"), optin_with_asc(Int(0), Global.current_application_address())]
        [Txn.application_args[0] == Bytes("withdrawAsset"), withdraw_asset],
        [Txn.application_args[0] == Bytes("buy"), buy()],
    )

    program = Cond(
        [Txn.application_id() == Int(0), on_create], # Setting Owner variable
        [Txn.on_completion() == OnComplete.NoOp, on_call],
    )
    return program

def clear(): 
    return Int(1)

# with open("approval.teal", "w") as f:
#     compiled = compileTeal(approval_program(), mode=Mode.Application, version=6)
#     f.write(compiled)

# with open("clear_state.teal", "w") as f:
#     compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=6)
#     f.write(compiled)
    
  
