#!/bin/bash

echo "----------------------------------------------------------------------------"
echo "          GENERATING DOCKER NETWORK"
echo "----------------------------------------------------------------------------"
#
docker network create --attachable --driver overlay mynetwork
#
echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "
