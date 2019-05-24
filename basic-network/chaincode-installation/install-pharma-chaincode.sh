#!/bin/bash

export CHANNEL_NAME=mychannel
export VERSION=1.4
export CHAINCODE_PATH=github.com/chaincode/pharma-app/
export CHAINCODE_NAME=pharmaapp
export LANGUAGE=golang
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


echo "----------------------------------------------------------------------------"
echo "          INSTALLING CHAINCODE ON PEER0"
echo "----------------------------------------------------------------------------"

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

peer chaincode install -n $CHAINCODE_NAME -v $VERSION -p $CHAINCODE_PATH



echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "


echo "----------------------------------------------------------------------------"
echo "          INSTALLING CHAINCODE ON PEER1"
echo "----------------------------------------------------------------------------"

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer1.org1.example.com:7051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt

peer chaincode install -n $CHAINCODE_NAME -v $VERSION -p $CHAINCODE_PATH


echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "





echo "----------------------------------------------------------------------------"
echo "          WAITING AFTER INSTALLING"
echo "----------------------------------------------------------------------------"

sleep 10

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "




# echo "----------------------------------------------------------------------------"
# echo "    UPGRADE CHAINCODE $CHAINCODE_NAME to verison $VERSION on $CHANNEL_NAME"
# echo "----------------------------------------------------------------------------"

# peer chaincode upgrade -o orderer.example.com:7050 --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -l $LANGUAGE -n $CHAINCODE_NAME -v $VERSION -p $CHAINCODE_PATH -c '{"Args":["init"]}' -P "AND ('Org1MSP.peer')"

# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "



echo "----------------------------------------------------------------------------"
echo "          INSTANTIATE CHAINCODE ON $CHANNEL_NAME"
echo "----------------------------------------------------------------------------"

peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n $CHAINCODE_NAME -v $VERSION -c '{"Args":["init"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "




echo "----------------------------------------------------------------------------"
echo "          WAITING FOR 5 SECONDS AFTER INSTANTIATING"
echo "----------------------------------------------------------------------------"

sleep 10

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "
#
#
#
#
#
#
echo "----------------------------------------------------------------------------"
echo "          INITIALIZING LEDGER"
echo "----------------------------------------------------------------------------"

peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n $CHAINCODE_NAME \
--peerAddresses peer0.org1.example.com:7051 \
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
--peerAddresses peer1.org1.example.com:7051 \
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt \
-c '{"function":"initLedger", "Args":[""]}'



echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "


echo "----------------------------------------------------------------------------"
echo "          WAITING FOR 10 SECONDS AFTER INITIALIZING"
echo "----------------------------------------------------------------------------"

sleep 10

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "





echo "----------------------------------------------------------------------------"
echo "          QUERYING SAMPLE CHAINCODE"
echo "----------------------------------------------------------------------------"

peer chaincode query -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"queryAllAssets","Args":[""]}'

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "
