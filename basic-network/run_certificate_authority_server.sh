#!/bin/bash


export CA_CONTAINER_NAME=ca_pharmatrack
export NETWORK_NAME=mynetwork
export FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
export FABRIC_CA_SERVER_CA_NAME=ca-pharmatrack
export FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca.org1.example.com-cert.pem
export FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/49b35b9e71cf53f46b7e0e85c9fcc1cf042e85af90be73c9f2657039fc9a31d2_sk
export FABRIC_CA_SERVER_TLS_KEYFILE=/etc/hyperledger/fabric-ca-server-config/49b35b9e71cf53f46b7e0e85c9fcc1cf042e85af90be73c9f2657039fc9a31d2_sk
export CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=mynetwork
export VOLUME_PATH=$PWD/crypto-config/peerOrganizations/org1.example.com/ca/


docker run --rm -it \
--network=$NETWORK_NAME \
--name $CA_CONTAINER_NAME \
-p 7054:7054 \
-e FABRIC_CA_HOME=$FABRIC_CA_HOME \
-e FABRIC_CA_SERVER_CA_NAME=$FABRIC_CA_SERVER_CA_NAME \
-e FABRIC_CA_SERVER_CA_CERTFILE=$FABRIC_CA_SERVER_CA_CERTFILE \
-e FABRIC_CA_SERVER_CA_KEYFILE=$FABRIC_CA_SERVER_CA_KEYFILE \
-e FABRIC_CA_SERVER_TLS_KEYFILE=$FABRIC_CA_SERVER_TLS_KEYFILE \
-v $VOLUME_PATH:/etc/hyperledger/fabric-ca-server-config \
-e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=$CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE hyperledger/fabric-ca sh -c 'fabric-ca-server start -b admin:adminpw -d'
