#!/bin/bash

export FABRIC_CFG_PATH=$PWD
export NETWORK_NAME=mynetwork
export CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=mynetwork
export COUCH_DB_NAME=peer0_couch_db
export COUCH_DB_HOST_PORT=5984
export COUCH_DB_CONTAINER_PORT=5984
export COUCH_DB_USER=admin
export COUCH_DB_PASSWORD=admin_password

echo "----------------------------------------------------------------------------"
echo "          POWERING UP COUCH DB FOR THIS PEER"
echo "----------------------------------------------------------------------------"

docker run --rm -it  \
--network=$NETWORK_NAME \
--name $COUCH_DB_NAME \
-p $COUCH_DB_HOST_PORT:$COUCH_DB_CONTAINER_PORT \
-e COUCHDB_USER=$COUCH_DB_USER \
-e COUCHDB_PASSWORD=$COUCH_DB_PASSWORD \
-e CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=$CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE hyperledger/fabric-couchdb

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "
