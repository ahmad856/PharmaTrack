#!/bin/bash


echo "----------------------------------------------------------------------------"
echo "          CREATING CHANNEL 1"
echo "----------------------------------------------------------------------------"

export CHANNEL_NAME=mychannel

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

export CORE_PEER_ADDRESS=peer0.org1.example.com:7051

export CORE_PEER_LOCALMSPID="Org1MSP"

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "




echo "----------------------------------------------------------------------------"
echo "          JOINING PEER0 TO CHANNEL"
echo "----------------------------------------------------------------------------"

peer channel join -b mychannel.block

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "



# echo "----------------------------------------------------------------------------"
# echo "          JOINING PEER 1 PEER TO CHANNEL"
# echo "----------------------------------------------------------------------------"

# export CHANNEL_NAME=mychannel

# export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

export CORE_PEER_ADDRESS=peer1.org1.example.com:7051

# export CORE_PEER_LOCALMSPID="Org1MSP"

# export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt

peer channel join -b mychannel.block


# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "


echo "----------------------------------------------------------------------------"
echo "          UPDATING ANCHOR PEER FOR CHANNEL"
echo "----------------------------------------------------------------------------"

export CHANNEL_NAME=mychannel

peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "


