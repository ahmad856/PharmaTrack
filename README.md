# Pharmaceutical Asset Tracking System on Hyperlegder Fabric Blockchain!

### Overview
The purpose of Pharma Track is to eliminate the risk of fraudulent pharmaceuticals entering the supply chain or to prevent the loss of products by keeping track of all the assets in the process using blockchain platform. It will serve as a tool for pharmaceutical companies and distributors to track the path of their assets through the supply chain. For buyers, such as distributors, chemists or customers, it will serve as a tool to verify the origins and authenticity of the products they have bought.

### Prerequisites
  - Node -v
    - v8.9 and higher (v9 not supported)
  - npm --version 
    - 5.6.0
  - Hyperledger Fabric
    - v1.3.0
  - Docker Engine
    - v17.03 or higher
  - Docker-Compose
    - v1.8 or higher
  - for more information on how to install Hyperledger Fabric navigate to https://hyperledger-fabric.readthedocs.io/en/release-1.4/getting_started.html

### Setup
```sh
  # clone the repository 
  $ https://github.com/ahmad856/PharmaTrack
  # change current directory
  $ cd PharmaTrack/pharma-app
  # install node modules
  $ npm install
```
### Start Application
```sh
  # change directory
  $ cd PharmaTrack/pharma-app
  # remove docker containers
  $ docker rm -f $(docker ps -aq)
  # start fabric
  $ ./startFabric.sh
  # remove keystore
  $ rm ~/.hfc-key-store/*\
  # register admin
  $ node registerAdmin.js
  # register user
  $ node registerUser.js
  # start application
  $ yarn dev
```

### Developer Options:
```sh
  # to use couchDB UI navigate to http://localhost:5984/_utils/#/_all_dbs
  # navigate to mychannel_pharma-app to check your database
```

### Structure
```sh
├── basic-network
│   ├── config
│   ├── start.sh
│   ├── stop.sh
│   ├── init.sh
│   ├── teardown.sh
│   ├── generate.sh
├── chaincode
│   ├── pharma-app
|   |   ├── pharma-chaincode.go
|   |   ├── read_ledger.go
|   |   ├── utility.go
|   |   ├── write_ledger.go
├── pharma-app
│   ├── client
|   |   ├── node_modules
|   |   ├── src (Front-End)
|   |   ├── package.json
│   ├── node_modules
│   ├── controller.js (Middleware)
│   ├── package.json
│   ├── registerAdmin.js
│   ├── registerUser.js
│   ├── routes.js (URLs path for request/response)
│   ├── server.js
│   ├── startFabric.sh
├── README.md
```

### Contact

For more inquiries and conversations, feel free to contact us at ahmadshahid856@gmail.com | kamranabdullah1998@gmail.com
