from pyteal import *

if __name__ == "__main__":
    print(compileTeal(approval(), mode=Mode.Application, version=6))

with open("counter.py", "rw") as f:
  f.write(approval)