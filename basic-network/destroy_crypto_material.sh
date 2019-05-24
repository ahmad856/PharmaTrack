#!/bin/bash


echo "----------------------------------------------------------------------------"
echo "          REMOVING CHANNEL ARTIFACTS"
echo "----------------------------------------------------------------------------"

sudo rm -r ./channel-artifacts/channel.tx
sudo rm -r ./channel-artifacts/Org1MSPanchors.tx

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "



echo "----------------------------------------------------------------------------"
echo "          DELETING GENEIS BLOCK"
echo "----------------------------------------------------------------------------"

rm ./channel-artifacts/genesis.block

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "




echo "----------------------------------------------------------------------------"
echo "          DELETING CRYPTO CONFIG BLOCK"
echo "----------------------------------------------------------------------------"

sudo rm -r ./crypto-config

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "
