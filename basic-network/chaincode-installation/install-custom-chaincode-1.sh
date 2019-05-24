#!/bin/bash



export CHANNEL_NAME=channel1
export VERSION=1.0
export CHAINCODE_PATH=github.com/chaincode/chaincode_example02/go/evas-2/
export CHAINCODE_NAME=evas4
export CONSTRUCTOR_STRING='{"Args":["init"]}'
export LANGUAGE=golang
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/evas.com/orderers/evas-orderer.evas.com/msp/tlscacerts/tlsca.evas.com-cert.pem


echo "----------------------------------------------------------------------------"
echo "          INSTALLING CHAINCODE ON CEC PEER"
echo "----------------------------------------------------------------------------"

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/users/Admin@ecp.evas.com/msp
export CORE_PEER_ADDRESS=chief-election-commission.ecp.evas.com:7051
export CORE_PEER_LOCALMSPID="ECPMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/chief-election-commission.ecp.evas.com/tls/ca.crt

peer chaincode install -n $CHAINCODE_NAME -v $VERSION -p $CHAINCODE_PATH



echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "


echo "----------------------------------------------------------------------------"
echo "          INSTALLING CHAINCODE ON PROVINCIAL ADMIN PEER"
echo "----------------------------------------------------------------------------"

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/users/Admin@ecp.evas.com/msp
export CORE_PEER_ADDRESS=provincial-admin.ecp.evas.com:7051
export CORE_PEER_LOCALMSPID="ECPMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/provincial-admin.ecp.evas.com/tls/ca.crt

peer chaincode install -n $CHAINCODE_NAME -v $VERSION -p $CHAINCODE_PATH


echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "




echo "----------------------------------------------------------------------------"
echo "          INSTALLING CHAINCODE ON DISTRICT ADMIN PEER"
echo "----------------------------------------------------------------------------"

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/users/Admin@ecp.evas.com/msp
export CORE_PEER_ADDRESS=district-admin.ecp.evas.com:7051
export CORE_PEER_LOCALMSPID="ECPMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/district-admin.ecp.evas.com/tls/ca.crt

peer chaincode install -n $CHAINCODE_NAME -v $VERSION -p $CHAINCODE_PATH


echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "



echo "----------------------------------------------------------------------------"
echo "          INSTALLING CHAINCODE ON CONSTITUENCY ADMIN PEER"
echo "----------------------------------------------------------------------------"

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/users/Admin@ecp.evas.com/msp
export CORE_PEER_ADDRESS=constituency-admin.ecp.evas.com:7051
export CORE_PEER_LOCALMSPID="ECPMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/constituency-admin.ecp.evas.com/tls/ca.crt

peer chaincode install -n $CHAINCODE_NAME -v $VERSION -p $CHAINCODE_PATH


echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "




# echo "----------------------------------------------------------------------------"
# echo "          INSTALLING CHAINCODE ON VOTING PEER"
# echo "----------------------------------------------------------------------------"
#
# export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/users/Admin@ecp.evas.com/msp
# export CORE_PEER_ADDRESS=voting.ecp.evas.com:7051
# export CORE_PEER_LOCALMSPID="ECPMSP"
# export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/voting.ecp.evas.com/tls/ca.crt
#
# peer chaincode install -n $CHAINCODE_NAME -v $VERSION -p $CHAINCODE_PATH
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "


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
#
# peer chaincode upgrade -o evas-orderer.evas.com:7050 --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -l $LANGUAGE -n $CHAINCODE_NAME -v $VERSION -p $CHAINCODE_PATH -c '{"Args":["init"]}' -P "AND ('ECPMSP.peer')"
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "



echo "----------------------------------------------------------------------------"
echo "          INSTANTIATE CHAINCODE ON $CHANNEL_NAME"
echo "----------------------------------------------------------------------------"

peer chaincode instantiate -o evas-orderer.evas.com:7050 --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n $CHAINCODE_NAME -v $VERSION -c '{"Args":["init"]}' -P "AND ('ECPMSP.peer')"

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

peer chaincode invoke -o evas-orderer.evas.com:7050 --tls true --cafile $ORDERER_CA \
-C $CHANNEL_NAME -n $CHAINCODE_NAME \
--peerAddresses chief-election-commission.ecp.evas.com:7051 \
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/chief-election-commission.ecp.evas.com/tls/ca.crt \
--peerAddresses provincial-admin.ecp.evas.com:7051 \
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/provincial-admin.ecp.evas.com/tls/ca.crt \
--peerAddresses district-admin.ecp.evas.com:7051 \
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/district-admin.ecp.evas.com/tls/ca.crt \
--peerAddresses constituency-admin.ecp.evas.com:7051 \
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/constituency-admin.ecp.evas.com/tls/ca.crt \
-c '{"Args":["initLedger"]}'


echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "
#
#
#
# echo "----------------------------------------------------------------------------"
# echo "          QUERYING SAMPLE CHAINCODE"
# echo "----------------------------------------------------------------------------"
#
# peer chaincode query -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"Args":["queryVote"]}'
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "
