#!/bin/bash

export FABRIC_CFG_PATH=$PWD

export NETWORK_NAME=mynetwork

export CLI_CONTAINER_NAME=cli

export ORDERER_CONTAINER_NAME=example.com
export ORDERER_CONTAINER_ALIAS=example.com

export PEER0_NAME=peer0.org1.example.com
export PEER1_NAME=peer1.org1.example.com

export PEER0_ALIAS=peer0.org1.example.com
export PEER1_ALIAS=peer1.org1.example.com



export GOPATH=/opt/gopath
export CORE_PEER_LOCALMSPID=Org1MSP

export CORE_PEER_TLS_ENABLED=true

export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

export CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
export FABRIC_LOGGING_SPEC=INFO



export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_NETWORKID=cli
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=mynetwork




export RUN=/var/run/

export CRYPTO_FOLDER_PATH=$PWD/crypto-config
export CHANNEL_ARTIFACTS_PATH=$PWD/channel-artifacts

export DOCKER_SHELL_COMMANDS=$PWD/run_dockershell_commands.sh
export CHAINCODE_PATH=$PWD/../chaincode/
export CHAINCODE_INSTALLATION_FOLDER_PATH=$PWD/chaincode-installation/




docker run --rm -it \
--network=$NETWORK_NAME \
--name cli \
--link $ORDERER_CONTAINER_NAME:$ORDERER_CONTAINER_ALIAS \
--link $PEER0_NAME:$PEER0_ALIAS \
--link $PEER1_NAME:$PEER1_ALIAS \
--link $DISTRICT_ADMIN_PEER_NAME:$DISTRICT_ADMIN_PEER_ALIAS \
--link $CONSTITUENCY_ADMIN_PEER_NAME:$CONSTITUENCY_ADMIN_PEER_ALIAS \
--link $VOTING_PEER_NAME:$VOTING_PEER_ALIAS \
-p 12051:7051 -p 12053:7053 \
-e GOPATH=$GOPATH \
-e CORE_PEER_LOCALMSPID=$CORE_PEER_LOCALMSPID \
-e CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED \
-e CORE_PEER_TLS_CERT_FILE=$CORE_PEER_TLS_CERT_FILE \
-e CORE_PEER_TLS_KEY_FILE=$CORE_PEER_TLS_KEY_FILE \
-e CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_TLS_ROOTCERT_FILE \
-e CORE_VM_ENDPOINT=$CORE_VM_ENDPOINT \
-e FABRIC_LOGGING_SPEC=$FABRIC_LOGGING_SPEC \
-e CORE_PEER_ID=$CORE_PEER_ID \
-e CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS \
-e CORE_PEER_NETWORKID=$CORE_PEER_NETWORKID \
-e CORE_PEER_MSPCONFIGPATH=$CORE_PEER_MSPCONFIGPATH \
-e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=$CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE  \
-v $RUN:/host/var/run/ \
-v $CRYPTO_FOLDER_PATH:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ \
-v $CHANNEL_ARTIFACTS_PATH:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts \
-v $DOCKER_SHELL_COMMANDS:/opt/gopath/src/github.com/hyperledger/fabric/peer/run_dockershell_commands.sh \
-v $CHAINCODE_PATH:/opt/gopath/src/github.com/chaincode \
-v $CHAINCODE_INSTALLATION_FOLDER_PATH:/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode-installation \
-w /opt/gopath/src/github.com/hyperledger/fabric/peer hyperledger/fabric-tools /bin/bash
