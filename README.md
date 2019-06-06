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
  # na2vigate to mychannel_pharma-app to check your database
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




### Development Guide


### Front-End (React JS) :
```sh
  # The front-end implementation in React JS can be found in pharma-app/client
  # The main pages can be found in pharma-app/client/pages
  # These React JS pages use a component named Axios to send GET and POST requests to the REST API
```

### Controller (Node JS) :
```sh
  # The REST API routes are defined in pharma-app/routes.js
  # The routes.js file calls controller functions defined in pharma-app/controller.js
  # The controller.js file implements one function for each route. It recieves request parameters from the front-end, invokes queries of Hyperledger Fabric chaincode, and returns the response to the front-end. 
```

## Back-End (Hyperledger Fabric/Golang) :
```sh
  # The chaincode (written in Go Language) found in the directory chaincode/pharma-app/
  # The chaincode defines the blockchain smart contracts in forms of structs and functions using the Hyperledger Fabric Interface (shim) 
  # The chaincode interacts with the two parts of blockchain i.e. the world-state (Couch DB) and the history ledger where data is stored in key-value pairs (JSON) 

  # The basic structure, classes and initialization are defined in the file pharma-chaincode.go
  # The functions which read from the blockchain are defined in read_ledger.go
  # The functions which write to the blockchain are defined in write_ledger.go
  # Some utility functions are defined in utility.go
```

### Contact

For more inquiries and conversations, feel free to contact us at ahmadshahid856@gmail.com | kamranabdullah1998@gmail.com
