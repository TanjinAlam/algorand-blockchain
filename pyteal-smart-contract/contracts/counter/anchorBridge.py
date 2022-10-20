from pyteal import *
from pyteal.ast.bytes import Bytes
from pyteal_helpers import program

def approval():
    # local variable for each users
    # global_owner = Bytes("owner")  # byteslice
    # local_owner = Bytes("owner")  # byteslice
    # local_balance = Bytes("balance")  # uint64

    # op_transfer = Bytes("assetTransfer")
    # op_withdraw = Bytes("assetWithdraw")

    #amount to withdraw
    withdraw_amount = Btoi(Txn.application_args[1])
    amount = Gtxn[0].asset_amount()
    creator = Txn.sender() == App.globalGet(Bytes("Creator"))
    scratch_counter = ScratchVar(TealType.uint64)
    receiver_addr = Gtxn[0].accounts[0]  
    register = Seq(
        [
            App.localPut(Int(0), Bytes("balance"), Int(0)), 
            Return(Int(1))
        ])

    # Oncreate of the app the creator, wNGN and wGHC will be on the global state
    on_create = Seq([
        App.globalPut(Bytes("Creator"), Txn.sender()), #Setting Creator == msg.sender()
        App.globalPut(Bytes("ACT"), Txn.assets[0]), # Creating ACT variable and assigning assetId of index 0
        Return(Int(1))
    ])

    transferable_assets = And(
        Txn.assets[0] == App.globalGet(Bytes("ACT")),
    ) 

    # Asset Transfer
    def transfer_asset_optin(assetIndex, amount, receiver):
        return Seq([
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.asset_receiver: receiver,
                TxnField.asset_amount: amount,
                TxnField.xfer_asset: Txn.assets[assetIndex], #ON CALL asset index 0 = wNGN and 1 = wGHC
            }),
            InnerTxnBuilder.Submit(),
        ])

    # Asset Transfer
    def transfer_asset(assetIndex, amount, receiver):
        return Seq([
            # Assert(amount <= App.localGet(receiver, Bytes("balance"))),
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.asset_receiver: receiver,
                TxnField.asset_amount: amount,
                TxnField.xfer_asset: Gtxn[1].assets[0], #ON CALL asset index 0 = ACT
            }),
            InnerTxnBuilder.Submit(),
            #Do we need to substrack value here or check leter
            # App.localPut(
            #     Int(0),
            #     Bytes("balance"),
            #     App.localGet(Int(0), Bytes("balance")) - amount,
            # ),
        ])

    contract_asset_optin = Seq([
        Assert(creator),
        Assert(Txn.assets[0] == App.globalGet(Bytes("ACT"))),
        #contract opting into ACT ASA
        transfer_asset_optin(0,Int(0), Global.current_application_address()),
        Approve()
    ])

    assets_withdrawal = Seq([
        Assert(creator), #Ensures only creator can make this call
        Assert(transferable_assets),
        #contract withdraw ACT ASA
        transfer_asset(0,withdraw_amount, receiver_addr),
        Approve(),
    ]) 


    #Switch cases for all noOp call's
    on_call = Cond(
        [Txn.application_args[0] == Bytes("contract_optin"), contract_asset_optin], #Opting wallet to this application
        [Txn.application_args[0] == Bytes("withdraw"), assets_withdrawal]
    )

    program = Cond(
        [Txn.application_id() == Int(0), on_create], # Setting Owner and setting ACT variable
        [Txn.on_completion() == OnComplete.NoOp, on_call],
        [Txn.on_completion() == OnComplete.OptIn, register],
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
    
  
