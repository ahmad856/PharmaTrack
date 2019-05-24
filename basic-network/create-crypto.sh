#!/bin/bash


echo "----------------------------------------------------------------------------"
echo "          GENERATING CRYPTO MATERIAL"
echo "----------------------------------------------------------------------------"
../bin/cryptogen generate --config=./crypto-config.yaml

export FABRIC_CFG_PATH=$PWD

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "




echo "----------------------------------------------------------------------------"
echo "          CREATE ORDERER GENESIS BLOCK"
echo "----------------------------------------------------------------------------"

../bin/configtxgen -profile OneOrgOrdererGenesis -channelID pharma-sys-channel -outputBlock ./channel-artifacts/genesis.block

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "







echo "----------------------------------------------------------------------------"
echo "          CREATING ARTIFACTS FOR CHANNEL 1"
echo "----------------------------------------------------------------------------"

export CHANNEL_NAME=mychannel


../bin/configtxgen -profile mychannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

../bin/configtxgen -profile mychannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "



