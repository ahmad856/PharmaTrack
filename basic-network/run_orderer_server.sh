#!/bin/bash


export NETWORK_NAME=mynetwork
export ORDERER_CONTAINER_NAME=orderer.example.com
# export ORDERER_GENERAL_LOGLEVEL=debug
export FABRIC_LOGGING_SPEC=INFO
export ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
export ORDERER_GENERAL_LISTENPORT=7050
export ORDERER_GENERAL_GENESISMETHOD=file
export ORDERER_GENERAL_GENESISFILE=/var/hyperledger/orderer/orderer.genesis.block
export ORDERER_GENERAL_LOCALMSPID=OrdererMSP
export ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp
export ORDERER_GENERAL_TLS_ENABLED=true
export ORDERER_GENERAL_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key
export ORDERER_GENERAL_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt
export ORDERER_GENERAL_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
export ORDERER_KAFKA_TOPIC_REPLICATIONFACTOR=1
export ORDERER_KAFKA_VERBOSE=true
export ORDERER_GENESIS_BLOCK_PATH=$PWD/channel-artifacts/genesis.block
export ORDERER_MSP_PATH=$PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp
export ORDERER_FOLDER_PATH=$PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/
export WORKING_DIRECTORY=/opt/gopath/src/github.com/hyperledger/fabric
export CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=mynetwork





docker run --rm -it  \
--network=$NETWORK_NAME \
--name $ORDERER_CONTAINER_NAME \
-p $ORDERER_GENERAL_LISTENPORT:$ORDERER_GENERAL_LISTENPORT \
-e FABRIC_LOGGING_SPEC=$FABRIC_LOGGING_SPEC \
-e ORDERER_GENERAL_LOGLEVEL=$ORDERER_GENERAL_LOGLEVEL \
-e ORDERER_GENERAL_LISTENADDRESS=$ORDERER_GENERAL_LISTENADDRESS \
-e ORDERER_GENERAL_LISTENPORT=$ORDERER_GENERAL_LISTENPORT \
-e ORDERER_GENERAL_GENESISMETHOD=$ORDERER_GENERAL_GENESISMETHOD \
-e ORDERER_GENERAL_GENESISFILE=$ORDERER_GENERAL_GENESISFILE \
-e ORDERER_GENERAL_LOCALMSPID=$ORDERER_GENERAL_LOCALMSPID \
-e ORDERER_GENERAL_LOCALMSPDIR=$ORDERER_GENERAL_LOCALMSPDIR \
-e ORDERER_GENERAL_TLS_ENABLED=$ORDERER_GENERAL_TLS_ENABLED \
-e ORDERER_GENERAL_TLS_PRIVATEKEY=$ORDERER_GENERAL_TLS_PRIVATEKEY \
-e ORDERER_GENERAL_TLS_CERTIFICATE=$ORDERER_GENERAL_TLS_CERTIFICATE \
-e ORDERER_GENERAL_TLS_ROOTCAS=$ORDERER_GENERAL_TLS_ROOTCAS \
-e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE \
-v $ORDERER_GENESIS_BLOCK_PATH:/var/hyperledger/orderer/orderer.genesis.block \
-v $ORDERER_MSP_PATH:/var/hyperledger/orderer/msp \
-v $ORDERER_FOLDER_PATH:/var/hyperledger/orderer \
-w $WORKING_DIRECTORY hyperledger/fabric-orderer orderer
