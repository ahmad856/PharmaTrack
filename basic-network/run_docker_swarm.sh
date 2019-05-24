#!/bin/bash


echo "----------------------------------------------------------------------------"
echo "          POWERING UP THE DOCKER SWARM"
echo "----------------------------------------------------------------------------"

docker swarm init

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "



echo "----------------------------------------------------------------------------"
echo "          POWERING UP THE DOCKER SWARM TOKEN MANAGER"
echo "----------------------------------------------------------------------------"

docker swarm join-token manager

echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
echo " "
echo " "



# echo "----------------------------------------------------------------------------"
# echo "          CREATING DOCKER NETWORK with name mynetwork"
# echo "----------------------------------------------------------------------------"
#
# docker network create --attachable --driver overlay mynetwork
#
# echo "!!!!!!!!!!      DONE!         !!!!!!!!!!!!"
# echo " "
# echo " "
