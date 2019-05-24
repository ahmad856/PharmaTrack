#!/bin/bash


export FABRIC_CFG_PATH=$PWD
export NETWORK_NAME=mynetwork
export CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=mynetwork
export COUCH_DB_NAME=peer1_couch
export COUCH_DB_HOST_PORT=5987
export COUCH_DB_CONTAINER_PORT=5984
export COUCH_DB_USER=admin
export COUCH_DB_PASSWORD=admin_password



echo "----------------------------------------------------------------------------"
echo "          ADDING _user db to COUCH DB"
echo "----------------------------------------------------------------------------"


curl -u $COUCH_DB_USER:$COUCH_DB_PASSWORD -X PUT http://127.0.0.1:$COUCH_DB_HOST_PORT/_users

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "




echo "----------------------------------------------------------------------------"
echo "          POWERING UP THE PEER ITSELF"
echo "----------------------------------------------------------------------------"




export PEER_CONTAINER_NAME=peer1.org1.example.com
export ORDERER_CONTAINER_NAME=orderer.example.com
export ORDERER_CONTAINER_ALIAS=orderer.example.com
export CORE_PEER_ADDRESS=peer1.org1.example.com:7051
export CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
export FABRIC_LOGGING_SPEC=INFO
export CORE_PEER_NETWORKID=peer1.org1.example.com
export CORE_NEXT=true
export CORE_PEER_ENDORSER_ENABLED=true
export CORE_PEER_ID=peer1.org1.example.com
export CORE_PEER_PROFILE_ENABLED=true
export ORDERER_CONTAINER_NAME=orderer.example.com
export ORDERER_CONTAINER_ALIAS=orderer.example.com
export CORE_PEER_COMMITTER_LEDGER_ORDERER=orderer.example.com:7050
export CORE_PEER_GOSSIP_IGNORESECURITY=true
export CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer1.org1.example.com:7051
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/peer/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/peer/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/peer/tls/ca.crt
export CORE_PEER_GOSSIP_USELEADERELECTION=true
export CORE_PEER_GOSSIP_ORGLEADER=false
export CORE_PEER_LOCALMSPID=Org1MSP

export RUN=/var/run/
export PEER_MSP_PATH=$PWD/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp
export PEER_PATH=$PWD/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com

export WORKING_DIRECTORY=/opt/gopath/src/github.com/hyperledger/fabric/peer



docker run --rm -it -d \
--link $ORDERER_CONTAINER_NAME:$ORDERER_CONTAINER_ALIAS \
--network=$NETWORK_NAME \
--name $PEER_CONTAINER_NAME \
-p 8051:7051 \
-p 8053:7053 \
-e CORE_LEDGER_STATE_STATEDATABASE=CouchDB \
-e CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=$COUCH_DB_NAME:$COUCH_DB_CONTAINER_PORT \
-e CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=$COUCH_DB_USER \
-e CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=$COUCH_DB_PASSWORD \
-e CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS \
-e CORE_VM_ENDPOINT=$CORE_VM_ENDPOINT \
-e FABRIC_LOGGING_SPEC=$FABRIC_LOGGING_SPEC \
-e CORE_PEER_NETWORKID=$CORE_PEER_NETWORKID \
-e CORE_NEXT=$CORE_NEXT \
-e CORE_PEER_ENDORSER_ENABLED=$CORE_PEER_ENDORSER_ENABLED \
-e CORE_PEER_ID=$CORE_PEER_ID \
-e CORE_PEER_PROFILE_ENABLED=$CORE_PEER_PROFILE_ENABLED \
-e CORE_PEER_COMMITTER_LEDGER_ORDERER=$CORE_PEER_COMMITTER_LEDGER_ORDERER \
-e CORE_PEER_GOSSIP_IGNORESECURITY=$CORE_PEER_GOSSIP_IGNORESECURITY \
-e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=$CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE \
-e CORE_PEER_GOSSIP_EXTERNALENDPOINT=$CORE_PEER_GOSSIP_EXTERNALENDPOINT \
-e CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED \
-e CORE_PEER_TLS_CERT_FILE=$CORE_PEER_TLS_CERT_FILE \
-e CORE_PEER_TLS_KEY_FILE=$CORE_PEER_TLS_KEY_FILE \
-e CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_TLS_ROOTCERT_FILE \
-e CORE_PEER_GOSSIP_USELEADERELECTION=$CORE_PEER_GOSSIP_USELEADERELECTION \
-e CORE_PEER_GOSSIP_ORGLEADER=$CORE_PEER_GOSSIP_ORGLEADER \
-e CORE_PEER_LOCALMSPID=$CORE_PEER_LOCALMSPID \
-v $RUN:/host/var/run/ \
-v $PEER_MSP_PATH:/etc/hyperledger/fabric/msp \
-v $PEER_PATH:/etc/hyperledger/fabric/peer \
-w $WORKING_DIRECTORY hyperledger/fabric-peer peer node start





echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "
