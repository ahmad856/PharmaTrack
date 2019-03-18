
Overview


Prerequisites


Setup
# Clone the repository
$ https://github.com/ahmad856/PharmaTrack
# install npm etc

Structure


Start Application:

1- Open Terminal
2- Change directory to PharmaTrack/pharma-app
3- Use the following commands to start the application

$ docker rm -f $(docker ps -aq)
$ ./startFabric.sh
$ rm ~/.hfc-key-store/*
$ node registerAdmin.js
$ yarn dev
$ node registerUser.js


Developer Options:

1- To Use CouchDB UI open this link
http://localhost:5984/_utils/#/_all_dbs

2-Navigate to mychannel_pharma-app to check your database
