#!/bin/bash



export CHANNEL_NAME=channel1
export VERSION=2.0
export CHAINCODE_PATH=github.com/chaincode/chaincode_example02/go/
export CHAINCODE_NAME=mycc


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





echo "----------------------------------------------------------------------------"
echo "          INSTANTIATE CHAINCODE ON CHANNEL - 1"
echo "----------------------------------------------------------------------------"

peer chaincode instantiate -o evas-orderer.evas.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/evas.com/orderers/evas-orderer.evas.com/msp/tlscacerts/tlsca.evas.com-cert.pem -C $CHANNEL_NAME -n $CHAINCODE_NAME -v $VERSION -c '{"Args":["init","a", "100", "b","200"]}' -P "AND ('ECPMSP.peer')"

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "




# echo "----------------------------------------------------------------------------"
# echo "          WAITING FOR 5 SECONDS AFTER INSTANTIATING"
# echo "----------------------------------------------------------------------------"
#
# sleep 5
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "
#
#
#
#
#
# echo "----------------------------------------------------------------------------"
# echo "          QUERYING SAMPLE CHAINCODE, EXPECTED OUTPUT = 100"
# echo "----------------------------------------------------------------------------"
#
# peer chaincode query -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"Args":["query","a"]}'
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "
#
#
#
# echo "----------------------------------------------------------------------------"
# echo "          WAITING FOR 5 SECONDS AFTER INVOKING"
# echo "----------------------------------------------------------------------------"
#
# sleep 5
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "
#
#
#
#
# echo "----------------------------------------------------------------------------"
# echo "          QUERYING SAMPLE CHAINCODE, CHANGING VALUE FROM 100 TO 90"
# echo "----------------------------------------------------------------------------"
#
# peer chaincode invoke -o evas-orderer.evas.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/evas.com/orderers/evas-orderer.evas.com/msp/tlscacerts/tlsca.evas.com-cert.pem -C $CHANNEL_NAME -n $CHAINCODE_NAME --peerAddresses chief-election-commission.ecp.evas.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/chief-election-commission.ecp.evas.com/tls/ca.crt --peerAddresses provincial-admin.ecp.evas.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/provincial-admin.ecp.evas.com/tls/ca.crt --peerAddresses district-admin.ecp.evas.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/district-admin.ecp.evas.com/tls/ca.crt --peerAddresses constituency-admin.ecp.evas.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ecp.evas.com/peers/constituency-admin.ecp.evas.com/tls/ca.crt -c '{"Args":["invoke","a","b","10"]}'
#
#
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "
#
#
#
#
#
#
#
#
# echo "----------------------------------------------------------------------------"
# echo "          WAITING FOR 5 SECONDS AFTER INVOKING"
# echo "----------------------------------------------------------------------------"
#
# sleep 5
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "
#
#
#
#
# echo "----------------------------------------------------------------------------"
# echo "          QUERYING SAMPLE CHAINCODE, VALUE SHOULD BE 90"
# echo "----------------------------------------------------------------------------"
#
# peer chaincode query -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"Args":["query","a"]}'
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "
