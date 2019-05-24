#!/bin/bash

# ./create-evas-network.sh
# ./create-crypto-material.sh
#
#
#
# ./remove_docker_swarm.sh
#
# ./run_docker_swarm.sh
#
#
# ./create-evas-network.sh

./create_pharma_network.sh

./run_certificate_authority_server.sh

./run_orderer_server.sh

./peer0_couch.sh

sleep 10

./peer0.sh


./peer1_couch.sh

sleep 10

./peer1.sh

./pharm_cli.sh
