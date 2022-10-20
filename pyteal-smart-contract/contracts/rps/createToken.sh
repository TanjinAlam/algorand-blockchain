#!/usr/bin/env bash

# load variables from config file
# source "$(dirname ${BASH_SOURCE[0]})/config.sh"

# create challenge transaction
goal asset create \
    --assetmetadatab64 "" \
    --asseturl "google.com" \
    --clawback "GACAVFPQ23VDXSTUV6EWOOGVFAJS7UWEJ7LV7THG5EEPLB3FTKUFGKNE3E" \
    --creator "GACAVFPQ23VDXSTUV6EWOOGVFAJS7UWEJ7LV7THG5EEPLB3FTKUFGKNE3E" \
    --decimals 8 \
    --dryrun-accounts "GACAVFPQ23VDXSTUV6EWOOGVFAJS7UWEJ7LV7THG5EEPLB3FTKUFGKNE3E" \
    --manager "GACAVFPQ23VDXSTUV6EWOOGVFAJS7UWEJ7LV7THG5EEPLB3FTKUFGKNE3E" \
    --name "ACT" \
    --total 100000000000 \
    --unitname "ACT" 
    -o challenge-call.tx

# create wager transaction

