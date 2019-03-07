docker stop $(docker ps -aq)

docker rm -f $(docker ps -aq)

./startFabric.sh

rm ~/.hfc-key-store/*

node registerAdmin.js

node registerUser.js
