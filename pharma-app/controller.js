//SPDX-License-Identifier: Apache-2.0

/*
  This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/fabcar/query.js
  and https://github.com/hyperledger/fabric-samples/blob/release/fabcar/invoke.js
 */

// call the packages we need
////////////////////////////email
"use strict";
const nodemailer = require("nodemailer");
////////////////////////////email

var express       = require('express');        // call express
var app           = express();                 // define our app using express
var bodyParser    = require('body-parser');
var http          = require('http')
var fs            = require('fs');
var Fabric_Client = require('fabric-client');
var path          = require('path');
var util          = require('util');
var os            = require('os');

module.exports = (function() {
	return{

		// 16	Discard Asset
		// 19	View Assets Details
		init_statics: function(req, res){
			console.log("init statics called");

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAllAssets - requires no arguments , ex: args: [''],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'initializeCounters',
			        args: ['']
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			        } else {
			            console.log("Response is ", query_responses[0].toString());
			              //res.json(JSON.parse(query_responses[0].toString()));
			              //res.send({ express: 'Hello From Express' });
					//res.send({ express: JSON.parse(query_responses[0].toString()) });
			        }
			    } else {
			        console.log("No payloads were returned from query");
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		// 4	View Details of Manufacturers
		// 6	View Details of Distributors
		// 8	View Details of Chemist
		// 12	View Details of Super Admin
		// 14	Super Admin Show Log
		get_all_users: function(req, res){
			console.log("getting all users from database: ");

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAllAssets - requires no arguments , ex: args: [''],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'readAllUsers',
			        args: ['']
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
						res.send({status:-1, express:-1});
			        } else {
			            console.log("Response is ", query_responses[0].toString());
						var temp=JSON.parse(query_responses[0].toString());
						var newManufacturers=temp.manufacturers.map( (manufacturer, index)=>({
							index: index+1,
							address: manufacturer.address,
							id: manufacturer.id,
							license: manufacturer.license,
							name: manufacturer.name,
							owneraddress: manufacturer.owneraddress,
							ownercnic: manufacturer.ownercnic,
							ownername: manufacturer.ownername,
							owneremail: manufacturer.owneremail,
							status: manufacturer.suspended ? "suspended":"active"
						}));
						temp.manufacturers=newManufacturers;
						var newDistributors=temp.distributors.map( (distributor, index)=>({
							index: index+1,
							address: distributor.address,
							id: distributor.id,
							license: distributor.license,
							name: distributor.name,
							owneraddress: distributor.owneraddress,
							ownercnic: distributor.ownercnic,
							ownername: distributor.ownername,
							owneremail: distributor.owneremail,
							status: distributor.suspended ? "suspended":"active"
						}));
						temp.distributors=newDistributors;
						var newChemists=temp.chemists.map( (chemist, index)=>({
							index: index+1,
							address: chemist.address,
							id: chemist.id,
							license: chemist.license,
							name: chemist.name,
							owneraddress: chemist.owneraddress,
							ownercnic: chemist.ownercnic,
							ownername: chemist.ownername,
							owneremail: chemist.owneremail,
							status: chemist.suspended ? "suspended":"active"
						}));
						temp.chemists=newChemists;
						var newAdmins=temp.admins.map( (admin, index)=>({
							index: index+1,
							id: admin.id,
							name: admin.name,
							cnic: admin.cnic,
							email: admin.email,
							status: admin.suspended ? "suspended":"active"
						}));
						temp.admins=newAdmins;
						var newAdminLogs=temp.adminlogs.map( (adminLog, index)=>({
							index: index+1,
							id: adminLog.id,
							adminId: adminLog.adminid,
							name: adminLog.adminname,
							description: adminLog.description
						}));
						temp.adminlogs=newAdminLogs;

						console.log(temp);
						//res.send({ status:1, express: JSON.parse(query_responses[0].toString()) });
						res.send({ status:1, express: temp });
			        }
			    } else {
			        console.log("No payloads were returned from query");
					res.send({status:-1, express:-1});
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		get_all_distributors: function(req, res){
			console.log('\n');
			console.log("getting all distributors from database: ");

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAllAssets - requires no arguments , ex: args: [''],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'readAllDistributors',
			        args: ['']
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
						res.send({status:-1, express:-1});
			        } else {
			            console.log("Response is ", query_responses[0].toString());
						var temp=JSON.parse(query_responses[0].toString());
						var newDistributors=temp.distributors.map( (distributor)=>({
							label: distributor.name+", "+distributor.address,
				            value: distributor.id,
						}));
						res.send({ status:1, express: newDistributors });
			        }
			    } else {
			        console.log("No payloads were returned from query");
					res.send({status:-1, express:-1});
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		get_all_chemists: function(req, res){
			console.log('\n');
			console.log("getting all chemist from database: ");

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);

				// get the enrolled user from persistence, this user will sign all requests
				return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
					console.log('Successfully loaded user1 from persistence');
					member_user = user_from_store;
				} else {
					throw new Error('Failed to get user1.... run registerUser.js');
				}

				// queryAllAssets - requires no arguments , ex: args: [''],
				const request = {
					chaincodeId: 'pharma-app',
					txId: tx_id,
					fcn: 'readAllChemists',
					args: ['']
				};

				// send the query proposal to the peer
				return channel.queryByChaincode(request);
			}).then((query_responses) => {
				console.log("Query has completed, checking results");
				// query_responses could have more than one  results if there multiple peers were used as targets
				if (query_responses && query_responses.length == 1) {
					if (query_responses[0] instanceof Error) {
						console.error("error from query = ", query_responses[0]);
						res.send({status:-1, express:-1});
					} else {
						console.log("Response is ", query_responses[0].toString());
						var temp=JSON.parse(query_responses[0].toString());
						var newChemists=temp.chemists.map( (chemist)=>({
							label: chemist.name+", "+chemist.address,
				            value: chemist.id,
						}));
						res.send({ status:1, express: newChemists });
					}
				} else {
					console.log("No payloads were returned from query");
					res.send({status:-1, express:-1});
				}
			}).catch((err) => {
				console.error('Failed to query successfully :: ' + err);
			});
		},

		get_all_assets: function(req, res){
			console.log("getting all assets from database: ");

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAllAssets - requires no arguments , ex: args: [''],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'queryAllAssets',
			        args: ['']
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			        } else {
			            console.log("Response is ", query_responses[0].toString());
			              //res.json(JSON.parse(query_responses[0].toString()));
			              //res.send({ express: 'Hello From Express' });
						  res.send({ express: JSON.parse(query_responses[0].toString()) });
			        }
			    } else {
			        console.log("No payloads were returned from query");
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		get_statics: function(req, res){

			console.log("get_statics function called.");

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);

				// get the enrolled user from persistence, this user will sign all requests
				return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
					console.log('Successfully loaded user1 from persistence');
					member_user = user_from_store;
				} else {
					throw new Error('Failed to get user1.... run registerUser.js');
				}

				// queryAsset - requires 1 argument, ex: args: ['4'],
				const request = {
					chaincodeId: 'pharma-app',
					txId: tx_id,
					fcn: 'getStaticVariables',
					args: ['']
				};

				// send the query proposal to the peer
				return channel.queryByChaincode(request);
			}).then((query_responses) => {
				console.log("Query has completed, checking results");
				// query_responses could have more than one  results if there multiple peers were used as targets
				if (query_responses && query_responses.length == 1) {
					if (query_responses[0] instanceof Error) {
						console.error("error from query = ", query_responses[0]);
						res.send({express:-1})
					} else {
						console.log("Response is ", query_responses[0].toString());
						//res.send(query_responses[0].toString())
						res.send({ express: JSON.parse(query_responses[0].toString()) });
					}
				} else {
					console.log("No payloads were returned from query");
					res.send({express:-1})
				}
			}).catch((err) => {
				console.error('Failed to query successfully :: ' + err);
			});
		},

		get_asset: function(req, res){

			console.log("get_asset function called.");

			var fabric_client = new Fabric_Client();
			var key = req.params.id

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAsset - requires 1 argument, ex: args: ['4'],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'queryAsset',
			        args: [key]
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			            res.send({ express:-1 });
			        } else {
			            console.log("Response is ", query_responses[0].toString());
			            //res.send(query_responses[0].toString())
						res.send({ express: JSON.parse(query_responses[0].toString()) });
			        }
			    } else {
			        console.log("No payloads were returned from query");
			        res.send({ express:-1 });
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		get_manufacturer_props: function(req, res){

			console.log("\n\nget manufacturer props function called.\n\n");

			var fabric_client = new Fabric_Client();
			var key = req.params.id

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAsset - requires 1 argument, ex: args: ['4'],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'initialReadManufacturer',
			        args: [key]
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			            res.send({ express:-1 });
			        } else {
			            console.log("Response is ", query_responses[0].toString());
			            //res.send(query_responses[0].toString())
						var temp = JSON.parse(query_responses[0].toString());

						if(temp.distributors==null){
							temp.distributors=[];
						}else{
							var newDistributors=temp.distributors.map( (distributor, index)=>({
								index: index+1,
								id: distributor.id,
								name: distributor.name,
								address: distributor.address,
								license: distributor.license,
								password: distributor.password,
								ownername: distributor.ownername,
								ownercnic: distributor.ownercnic,
								owneraddress: distributor.owneraddress,
								email:distributor.email,
								status:distributor.suspended ? "suspended":"active",
							}));
							temp.distributors=newDistributors;
						}
						if(temp.products==null){
							temp.products=[];
						}else{
							var newProducts=temp.products.map( (product, index)=>({
								index: index+1,
								id: product.id,
								name: product.name,
								type: product.type,
								description: product.description,
								retailprice: product.retailprice,
								unitquantity: product.unitquantity,
								cartoncapacity: product.cartoncapacity,
								packetcapacity: product.packetcapacity,
								manufacturerid:product.manufacturerid,
							}));
							temp.products=newProducts;
						}
						if(temp.pharmaassets==null){
							temp.pharmaassets=[];
						}else{
							var newPharmaAssets=temp.pharmaassets.map( (asset, index)=>({
								index: index+1,
								id: asset.id,
								productid: asset.productid,
								manufactureDate: asset.manufactureDate,
								expiryDate: asset.expiryDate,
								owner: asset.owner,
								ownername: asset.ownername,
								customer: asset.customer,
							}));
							temp.pharmaassets=newPharmaAssets;
						}
						console.log(temp);
						res.send({ express: temp });
			        }
			    } else {
			        console.log("No payloads were returned from query");
			        res.send({ express:-1 });
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		get_distributor_props: function(req, res){

			console.log("\n\nget distributor props function called.\n\n");

			var fabric_client = new Fabric_Client();
			var key = req.params.id

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAsset - requires 1 argument, ex: args: ['4'],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'initialReadDistributor',
			        args: [key]
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			            res.send({ express:-1 });
			        } else {
			            console.log("Response is ", query_responses[0].toString());
			            //res.send(query_responses[0].toString())
						var temp = JSON.parse(query_responses[0].toString());

						if(temp.chemists==null){
							temp.chemists=[];
						}else{
							var newChemists=temp.chemists.map( (chemist, index)=>({
								index: index+1,
								id: chemist.id,
								name: chemist.name,
								address: chemist.address,
								license: chemist.license,
								password: chemist.password,
								ownername: chemist.ownername,
								ownercnic: chemist.ownercnic,
								owneraddress: chemist.owneraddress,
								email:chemist.email,
								status:chemist.suspended ? "suspended":"active",
							}));
							temp.chemists=newChemists;
						}
						if(temp.pharmaassets==null){
							temp.pharmaassets=[];
						}else{
							var newPharmaAssets=temp.pharmaassets.map( (asset, index)=>({
								index: index+1,
								id: asset.id,
								productid: asset.productid,
								manufactureDate: asset.manufactureDate,
								expiryDate: asset.expiryDate,
								owner: asset.owner,
								ownername: asset.ownername,
								customer: asset.customer,
							}));
							temp.pharmaassets=newPharmaAssets;
						}
						console.log(temp);
						res.send({ express: temp });
			        }
			    } else {
			        console.log("No payloads were returned from query");
			        res.send({ express:-1 });
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		get_chemist_props: function(req, res){

			console.log("\n\nget chemist props function called.\n\n");

			var fabric_client = new Fabric_Client();
			var key = req.params.id

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAsset - requires 1 argument, ex: args: ['4'],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'initialReadChemist',
			        args: [key]
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			            res.send({ express:-1 });
			        } else {
			            console.log("Response is ", query_responses[0].toString());
			            //res.send(query_responses[0].toString())
						var temp = JSON.parse(query_responses[0].toString());

						if(temp.pharmaassets==null){
							temp.pharmaassets=[];
						}else{
							var newPharmaAssets=temp.pharmaassets.map( (asset, index)=>({
								index: index+1,
								id: asset.id,
								productid: asset.productid,
								manufactureDate: asset.manufactureDate,
								expiryDate: asset.expiryDate,
								owner: asset.owner,
								ownername: asset.ownername,
								customer: asset.customer,
							}));
							temp.pharmaassets=newPharmaAssets;
						}
						console.log(temp);
						res.send({ express: temp });
			        }
			    } else {
			        console.log("No payloads were returned from query");
			        res.send({ express:-1 });
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		// 5	Suspend/Activate Manufacturer
		// 7	Suspend/Activate Distributors
		// 9	Suspend/Activate Chemist
		// 13	Suspend/Activate Super Admin
		/*
		It takes 3 argument --
		 -> adminID
		 -> userID to activate/suspend
		 -> activate/suspend(string)
		*/
		toggle_status: function(req, res){
			console.log("toggle status of user: ");
			console.log(req.body.post);
			var array = req.body.post.split("~");
			console.log(array);
			var adminId = array[0]
			var id = array[1]
			var status = array[2]

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // send proposal to endorser
			    const request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'toggleSuspendUser',
			        args: [adminId, id, status],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
					res.send({ express: {status:-1, tx_id:-1} });
			        throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 15	Create Asset
		add_asset: function(req, res){
			console.log("submit recording of a asset: ");
			console.log(req.body.post);
			var array = req.body.post.split("~");
			console.log(array);

			var id = array[0]
			var qr = array[1]
			var name = array[2]
			var description = array[3]
			var owner = array[4]
			var type = array[5]
			var price = array[6]
			var mgfDate = array[7]
			var expDate = array[8]
			var qty = array[9]
			var timestamp = array[10]

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // recordAsset - requires 4 args, ID, name, timestamp, owner - ex: args: ['10', 'panadol', '1504054225', 'Hansel'],
			    // send proposal to endorser
			    const request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'recordAsset',
			        args: [id, qr, name, description, owner, type, price, mgfDate, expDate, qty, timestamp],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			        throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		/*
		It takes 8 argument --
		 -> manufacturerID
		 -> magnificationDate
		 -> expiryDate
		 -> quantity
		*/
		add_batch: function(req, res){
			console.log("submit recording of a batch: ");
			console.log(req.body.post);
			var array = req.body.post.split("~");
			console.log(array);

			var manufId = array[0]
			var prodId = array[1]
			var mgfDate = array[2]
			var expDate = array[3]
			var qty = array[4]

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // recordAsset - requires 4 args, ID, name, timestamp, owner - ex: args: ['10', 'panadol', '1504054225', 'Hansel'],
			    // send proposal to endorser
			    const request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'createBatch',
			        args: [manufId, prodId, mgfDate, expDate, qty],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			        throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		/*
		It takes 8 argument --
		 -> manufacturerID
		 -> productName
		 -> type
		 -> description
		 -> retailprice
		 -> unitquantity
		 -> carton capacity
		 -> packetcapacity
		*/
		add_product: function(req, res){
			console.log("submit recording of a product: ");
			console.log(req.body.post);
			var array = req.body.post.split("~");
			console.log(array);

			var manufId = array[0];
	        var name=array[1];
	        var type=array[2];
	        var description=array[3];
	        var retailPrice=array[4];
	        var unitQty=array[5];
	        var cartonCap=array[6];
	        var packetCap=array[7];

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // recordAsset - requires 4 args, ID, name, timestamp, owner - ex: args: ['10', 'panadol', '1504054225', 'Hansel'],
			    // send proposal to endorser
			    const request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'createProduct',
			        args: [manufId, name, type, description, retailPrice, unitQty, cartonCap, packetCap],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			        throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 1	Add Manufacturer
		/*
		It takes 10 argument --
		 -> company name
		 -> company address
		 -> company license
		 -> owner name
		 -> owner cnic
		 -> owner address
		 -> owner email
		 -> account password
		 -> account id
		 -> admin ID
		*/
		add_manufacturer: function(req, res){
			console.log("submit recording of a manufacturer: ");
			console.log(req.body.post);
			var array = req.body.post.split("~");
			console.log(array);
			var comp = array[0]
			var address = array[1]
			var license = array[2]
			var owner = array[3]
			var cnic = array[4]
			var ownerAddress = array[5]
			var email = array[6]
			var password = array[7]
			var id = array[8]
			var adminId = array[9]

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // send proposal to endorser
			    const request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'recordManufacturer',
			        args: [adminId, comp, address, license, owner, cnic, ownerAddress, password, email],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			        throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
						////////////////////////////email
						nodemailer.createTestAccount((err,account)=>{
							let transporter = nodemailer.createTransport({
							    service: "Gmail",
							    auth: {
							    	user: "pharmatrack2k18@gmail.com",
							    	pass: "pharmatracc"
						  		}
							});

							let mailOptions = {
								from:'"Pharma Track" <pharmatrack2k18@gmail.com>',
								to:email,
								subject:"Welcome to PharmaTrack",
								text:"Respected user,\nYour Account for PharmaTrack has been created.\nPlease login using your ID : "+id+" and Password : "+password+".\nRegards,\nPharma Team."
							};

							transporter.sendMail(mailOptions, (error, info) => {
								if(error){
									console.log(error)
									return console.log(error);
								}
								console.log("Message sent: %s", info.messageId);
								console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
							});
						});
						////////////////////////////email
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 2	Add Distributor
		/*
		It takes 10 argument --
		 -> company name
		 -> company address
		 -> company license
		 -> owner name
		 -> owner cnic
		 -> owner address
		 -> owner email
		 -> account password
		 -> account id
		 -> admin ID
		*/
		add_distributor: function(req, res){
			console.log("submit recording of a Distributor: ");
			console.log(req.body.post);
			var array = req.body.post.split("~");
			console.log(array);

			var comp = array[0]
			var address = array[1]
			var license = array[2]
			var owner = array[3]
			var cnic = array[4]
			var ownerAddress = array[5]
			var email = array[6]
			var password = array[7]
			var id = array[8]
			var adminId = array[9]

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // send proposal to endorser
			    const request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'recordDistributor',
			        args: [adminId, comp, address, license, owner, cnic, ownerAddress, password, email],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			        throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
			    if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
						////////////////////////////email
						nodemailer.createTestAccount((err,account)=>{
							let transporter = nodemailer.createTransport({
							    service: "Gmail",
							    auth: {
							    	user: "pharmatrack2k18@gmail.com",
							    	pass: "pharmatracc"
						  		}
							});

							let mailOptions = {
								from:'"Pharma Track" <pharmatrack2k18@gmail.com>',
								to:email,
								subject:"Welcome to PharmaTrack",
								text:"Respected user,\nYour Account for PharmaTrack has been created.\nPlease login using your ID : "+id+" and Password : "+password+".\nRegards,\nPharma Team."
							};

							transporter.sendMail(mailOptions, (error, info) => {
								if(error){
									console.log(error)
									return console.log(error);
								}
								console.log("Message sent: %s", info.messageId);
								console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
							});
						});
						////////////////////////////email
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 3	Add Chemist
		/*
		It takes 10 argument --
		 -> company name
		 -> company address
		 -> company license
		 -> owner name
		 -> owner cnic
		 -> owner address
		 -> owner email
		 -> account password
		 -> account id
		 -> admin ID
		*/
		add_chemist: function(req, res){
			console.log("submit recording of a Chemist: ");
			console.log(req.body.post);
			var array = req.body.post.split("~");
			console.log(array);

			var comp = array[0]
			var address = array[1]
			var license = array[2]
			var owner = array[3]
			var cnic = array[4]
			var ownerAddress = array[5]
			var email = array[6]
			var password = array[7]
			var id = array[8]
			var adminId = array[9]

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // send proposal to endorser
			    const request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'recordChemist',
			        args: [adminId, comp, address, license, owner, cnic, ownerAddress, password, email],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			        throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
						////////////////////////////email
						nodemailer.createTestAccount((err,account)=>{
							let transporter = nodemailer.createTransport({
							    service: "Gmail",
							    auth: {
							    	user: "pharmatrack2k18@gmail.com",
							    	pass: "pharmatracc"
						  		}
							});

							let mailOptions = {
								from:'"Pharma Track" <pharmatrack2k18@gmail.com>',
								to:email,
								subject:"Welcome to PharmaTrack",
								text:"Respected user,\nYour Account for PharmaTrack has been created.\nPlease login using your ID : "+id+" and Password : "+password+".\nRegards,\nPharma Team."
							};

							transporter.sendMail(mailOptions, (error, info) => {
								if(error){
									console.log(error)
									return console.log(error);
								}
								console.log("Message sent: %s", info.messageId);
								console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
							});
						});
						////////////////////////////email
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 11	Add Super Admin
		/*
		It takes 6 argument --
		 -> admin name
		 -> admin cnic
		 -> admin email
		 -> account password
		 -> account id
		 -> admin ID
		*/
		add_admin: function(req, res){
			console.log("submit recording of a admin: ");
			console.log(req.body.post);
			var array = req.body.post.split("~");
			console.log(array);
			var name = array[0]
			var cnic = array[1]
			var email = array[2]
			var password = array[3]
			var id = array[4]
			var adminId = array[5]

			////////////////////////////email
			nodemailer.createTestAccount((err,account)=>{
				let transporter = nodemailer.createTransport({
				    service: "Gmail",
				    auth: {
				    	user: "pharmatrack2k18@gmail.com",
				    	pass: "pharmatracc"
			  		}
				});

				let mailOptions = {
					from:'"Pharma Track" <pharmatrack2k18@gmail.com>',
					to:email,
					subject:"Test",
					text:"testing for email, pssword module is testing!!!"
				};

				transporter.sendMail(mailOptions, (error, info) => {
					if(error){
						console.log(error)
						return console.log(error);
					}
					console.log("Message sent: %s", info.messageId);
					console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
				});
			});
			////////////////////////////email

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // recordManufacturer - requires 4 args, ID, name, timestamp, address - ex: args: ['10', 'panadol', '1504054225', 'Hansel'],
			    // send proposal to endorser
			    const request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'createAdmin',
			        args: [adminId, name, password, cnic, email],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			        throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
						////////////////////////////email
						nodemailer.createTestAccount((err,account)=>{
							let transporter = nodemailer.createTransport({
							    service: "Gmail",
							    auth: {
							    	user: "pharmatrack2k18@gmail.com",
							    	pass: "pharmatracc"
						  		}
							});

							let mailOptions = {
								from:'"Pharma Track" <pharmatrack2k18@gmail.com>',
								to:email,
								subject:"Welcome to PharmaTrack",
								text:"Respected user,\nYour Account for PharmaTrack has been created.\nPlease login using your ID : "+id+" and Password : "+password+".\nRegards,\nPharma Team."
							};

							transporter.sendMail(mailOptions, (error, info) => {
								if(error){
									console.log(error)
									return console.log(error);
								}
								console.log("Message sent: %s", info.messageId);
								console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
							});
						});
						////////////////////////////email
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 28	Update Profile admin
		/*
		It takes 5 argument --
		 -> admin ID to be updated
		 -> new admin name
		 -> new account password
		 -> new admin CNIC
		 -> new admin email
		*/
		update_admin: function(req, res){
			console.log("updating admin: ");

			var array = req.body.post.split("~");
			console.log(array);
			var id = array[0]
			var name = array[1];
			var password = array[2]
			var cnic = array[3];
			var email = array[4];

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // changeAssetOwner - requires 2 args , ex: args: ['1', 'Barry'],
			    // send proposal to endorser
			    var request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'updateAdmin',
			        args: [id,name,password,cnic,email],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
					res.send({ express: {status:-1, tx_id:-1} });
					//res.send("Error: no asset found");
			        // throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 18	Transactions to Distributor
		// 25	Transactions to Chemist
		/*
		It takes 3 argument --
		 -> user ID
		 -> asset id
		 -> new owner id
		*/
		change_owner: function(req, res){
			console.log("changing owner of asset: ");

			var array = req.body.post.split("~");

			var userid = array[0];
			var key = array[1];
			var owner = array[2];

			console.log(userid);
			console.log(key);
			console.log(owner);

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // changeAssetOwner - requires 2 args , ex: args: ['1', 'Barry'],
			    // send proposal to endorser
			    var request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'changeAssetOwner',
			        args: [userid, key, owner],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
					res.send({ express: {status:-1, tx_id:-1} });
					//res.send("Error: no asset found");
			        // throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 23	Return Asset
		/*
		It takes 2 argument --
		 -> asset id
		 -> new owner id
		*/
		return_asset: function(req, res){
			console.log("returning asset: ");

			var array = req.body.post.split("~");

			var key = array[1];
			var owner = array[0];

			console.log(key);
			console.log(owner);

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // changeAssetOwner - requires 2 args , ex: args: ['1', 'Barry'],
			    // send proposal to endorser
			    var request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'returnAsset',
			        args: [owner, key],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
					res.send({ express: {status:-1, tx_id:-1} });
					//res.send("Error: no asset found");
			        // throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 21	Enroll Distributor
		/*
		It takes 2 argument --
		 -> manufacturor id
		 -> distributor id
		*/
		enroll_distributor: function(req, res){
			console.log("enroll_distributor called ");

			var array = req.body.post.split("~");

			var key = array[0]
			var dist = array[1];

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // changeAssetOwner - requires 2 args , ex: args: ['1', 'Barry'],
			    // send proposal to endorser
			    var request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'enrollDistributor',
			        args: [key, dist],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
					res.send({ express: {status:-1, txd:-1} });
					//res.send("Error: no asset found");
			        // throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 22	Enroll Chemist
		/*
		It takes 2 argument --
		 -> distributor id
		 -> chemist id
		*/
		enroll_chemist: function(req, res){
			console.log("enroll_chemist called ");

			var array = req.body.post.split("~");

			var key = array[0]
			var chem = array[1];

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // changeAssetOwner - requires 2 args , ex: args: ['1', 'Barry'],
			    // send proposal to endorser
			    var request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'enrollChemist',
			        args: [key, chem],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
					res.send({ express: {status:-1, txd:-1} });
			        //res.send("Error: no asset found");
			        // throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 27	Product Verification
		// 20	View Assets Transaction History
		/*
		It takes 1 argument --
		 -> asset id
		*/
		get_history: function(req, res){

			console.log("get_history function called.");
			console.log("Post",req.params.id);
			var fabric_client = new Fabric_Client();
			var key = req.params.id;
			console.log(key);

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // getTransactionHistory - requires 1 argument, ex: args: ['4'],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'getTransactionHistory',
			        args: [key]
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			            res.send({ express: -1 });
			        } else {
			            console.log("Response is ", query_responses[0].toString());
			            res.send({ express: JSON.parse(query_responses[0].toString()) });
			        }
			    } else {
			        console.log("No payloads were returned from query");
			        res.send({ express: -1 });
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		get_supplier: function(req, res){

			console.log("get_supplier function called.");
			console.log("Post",req.params.id);
			var fabric_client = new Fabric_Client();
			var key = req.params.assetid;
			var user = req.params.userid;
			console.log(key);

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // getTransactionHistory - requires 1 argument, ex: args: ['4'],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'getSupplier',
			        args: [key, user]
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			            res.send({ express: -1 });
			        } else {
			            console.log("Response is ", query_responses[0].toString());
			            res.send({ express: JSON.parse(query_responses[0].toString()) });
			        }
			    } else {
			        console.log("No payloads were returned from query");
			        res.send({ express: -1 });
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		get_user: function(req, res){
			console.log('\n\n');
			console.log("get_user function called.");
			console.log('\n\n');

			var fabric_client = new Fabric_Client();
			var key = req.params.id
			console.log(key);

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all rvar temp=JSON.parse(query_responses[0].toString());equests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAsset - requires 1 argument, ex: args: ['4'],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'login',
			        args: [key]
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			            res.send({ express: -1 });
			        } else {
			            console.log("Response is ", query_responses[0].toString());
						var temp=JSON.parse(query_responses[0].toString());
						if(temp.id.substring(0,5)!="admin"){
							if(temp.id.substring(0,4)=="manu"){
								if(temp.products==null){
									temp.products=[];
								}
								if(temp.distributors==null){
									temp.distributors=[];
								}
							}
							if(temp.id.substring(0,4)=="dist"){
								if(temp.chemists==null){
									temp.chemists=[];
								}
							}
							if(temp.assets==null){
								temp.assets=[];
							}
							console.log("user",temp);
						}
						res.send({ express: temp });
			        }
			    } else {
			        console.log("No payloads were returned from query");
			        res.send({ express: -1 });
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		// 26	Sell Asset
		/*
		It takes 5 argument --
		 -> chemist id
		 -> asset id
		 -> customer name
		 -> customer phone
		 -> timestamp
		*/
		sell_asset: function(req, res){
			console.log("selling asset: ");

			var array = req.body.post.split("~");

			var userid = array[0];
			var assetid = array[1];
			var name = array[2];
			var phone = array[3];
			var timestamp = array[4];

			console.log(assetid);
			console.log(name);
			console.log(phone);
			console.log(timestamp);

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // get a transaction id object based on the current user assigned to fabric client
			    tx_id = fabric_client.newTransactionID();
			    console.log("Assigning transaction_id: ", tx_id._transaction_id);

			    // changeAssetOwner - requires 2 args , ex: args: ['1', 'Barry'],
			    // send proposal to endorser
			    var request = {
			        //targets : --- letting this default to the peers assigned to the channel
			        chaincodeId: 'pharma-app',
			        fcn: 'sellAsset',
			        args: [userid, assetid, name, phone, timestamp],
			        chainId: 'mychannel',
			        txId: tx_id
			    };

			    // send the transaction proposal to the peers
			    return channel.sendTransactionProposal(request);
			}).then((results) => {
			    var proposalResponses = results[0];
			    var proposal = results[1];
			    let isProposalGood = false;
			    if (proposalResponses && proposalResponses[0].response &&
			        proposalResponses[0].response.status === 200) {
			            isProposalGood = true;
			            console.log('Transaction proposal was good');
			        } else {
						console.error('Transaction proposal was bad',proposalResponses);
			        }
			    if (isProposalGood) {
			        console.log(util.format(
			            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
			            proposalResponses[0].response.status, proposalResponses[0].response.message));

			        // build up the request for the orderer to have the transaction committed
			        var request = {
			            proposalResponses: proposalResponses,
			            proposal: proposal
			        };

			        // set the transaction listener and set a timeout of 30 sec
			        // if the transaction did not get committed within the timeout period,
			        // report a TIMEOUT status
			        var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
			        var promises = [];

			        var sendPromise = channel.sendTransaction(request);
			        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

			        // get an eventhub once the fabric client has a user assigned. The user
			        // is required bacause the event registration must be signed
			        let event_hub = channel.newChannelEventHub('localhost:7051');
			        // event_hub.setPeerAddr('grpc://localhost:7053');

			        // using resolve the promise so that result status may be processed
			        // under the then clause rather than having the catch clause process
			        // the status
			        let txPromise = new Promise((resolve, reject) => {
			            let handle = setTimeout(() => {
			                event_hub.disconnect();
			                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
			            }, 3000);
			            event_hub.connect();
			            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
			                // this is the callback for transaction event status
			                // first some clean up of event listener
			                clearTimeout(handle);
			                event_hub.unregisterTxEvent(transaction_id_string);
			                event_hub.disconnect();

			                // now let the application know what happened
			                var return_status = {event_status : code, tx_id : transaction_id_string};
			                if (code !== 'VALID') {
			                    console.error('The transaction was invalid, code = ' + code);
			                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
			                } else {
			                    console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
			                    resolve(return_status);
			                }
			            }, (err) => {
			                //this is the callback if something goes wrong with the event registration or processing
			                reject(new Error('There was a problem with the eventhub ::'+err));
			            });
			        });
			        promises.push(txPromise);

			        return Promise.all(promises);
			    } else {
			        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
					res.send({ express: {status:-1, tx_id:-1} });
					//res.send("Error: no asset found");
			        // throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
			    }
			}).then((results) => {
			    console.log('Send transaction promise and event listener promise have completed');
			    // check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
			        console.log('Successfully sent transaction to the orderer.');
					if(results && results[1] && results[1].event_status === 'VALID') {
				        console.log('Successfully committed the change to the ledger by the peer');
				        res.send({ express: {status:1, tx_id:tx_id.getTransactionID()} });
				    } else {
				        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
						res.send({ express: {status:-1, tx_id:-1} });
				    }
			    } else {
			        console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send({ express: {status:-1, tx_id:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to invoke successfully :: ' + err);
			});
		},

		// 10	Login
		/*
		It takes 2 argument --
		 -> id
		 -> password
		*/
		sign_in: function(req, res){
			console.log('\n\n');
			console.log("sign in function called.");
			console.log('\n\n');

			var fabric_client = new Fabric_Client();
			var id = req.params.id;
			var password = req.params.password;
			console.log(id);
			console.log(password);

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:'+store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({ path: store_path
			}).then((state_store) => {
			    // assign the store to the fabric client
			    fabric_client.setStateStore(state_store);
			    var crypto_suite = Fabric_Client.newCryptoSuite();
			    // use the same location for the state store (where the users' certificate are kept)
			    // and the crypto store (where the users' keys are kept)
			    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
			    crypto_suite.setCryptoKeyStore(crypto_store);
			    fabric_client.setCryptoSuite(crypto_suite);

			    // get the enrolled user from persistence, this user will sign all requests
			    return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
			    if (user_from_store && user_from_store.isEnrolled()) {
			        console.log('Successfully loaded user1 from persistence');
			        member_user = user_from_store;
			    } else {
			        throw new Error('Failed to get user1.... run registerUser.js');
			    }

			    // queryAsset - requires 1 argument, ex: args: ['4'],
			    const request = {
			        chaincodeId: 'pharma-app',
			        txId: tx_id,
			        fcn: 'login',
			        args: [id]
			    };

			    // send the query proposal to the peer
			    return channel.queryByChaincode(request);
			}).then((query_responses) => {
			    console.log("Query has completed, checking results");
			    // query_responses could have more than one  results if there multiple peers were used as targets
			    if (query_responses && query_responses.length == 1) {
			        if (query_responses[0] instanceof Error) {
			            console.error("error from query = ", query_responses[0]);
			            //res.send("Could not locate user");
						res.send({ express: {status:-1, userSighnedIn:-1} });
			        } else {
			            console.log("Response is ", query_responses[0].toString());
						var temp=JSON.parse(query_responses[0].toString());///////fetched object with id
						if(temp.id.substring(0,5)=="admin"){
							if(temp.password==password){
								//id and password ok 1 for admin
								res.send({ express: {status:1, userSighnedIn:1} });
							}else{
								//wrong password
								res.send({ express: {status:-2, userSighnedIn:-1} });
							}
						} else if(temp.id.substring(0,4)=="manu"){
							if(temp.password==password){
								//id and password ok 2 for manufacturer
								res.send({ express: {status:1, userSighnedIn:2} });
							}else{
								//wrong password
								res.send({ express: {status:-2, userSighnedIn:-1} });
							}
						} else if(temp.id.substring(0,4)=="dist"){
							if(temp.password==password){
								//id and password ok 3 for distributor
								res.send({ express: {status:1, userSighnedIn:3} });
							}else{
								//wrong password
								res.send({ express: {status:-2, userSighnedIn:-1} });
							}
						} else if(temp.id.substring(0,4)=="chem"){
							if(temp.password==password){
								//id and password ok 4 for chemist
								res.send({ express: {status:1, userSighnedIn:4} });
							}else{
								//wrong password
								res.send({ express: {status:-2, userSighnedIn:-1} });
							}
						}else{
							////////no user found
							res.send({ express: {status:-1, userSighnedIn:-1} });
						}
			        }
			    } else {
			        console.log("No payloads were returned from query");
			        //res.send("Could not locate user")
					res.send({ express: {status:-1, userSighnedIn:-1} });
			    }
			}).catch((err) => {
			    console.error('Failed to query successfully :: ' + err);
			});
		},

		email: function(req, res){
			console.log('\n\n');
			console.log("email function called.");
			console.log('\n\n');

			var body = req.body.post;

			//var body = req.params.bodytext;

			////////////////////////////email
			nodemailer.createTestAccount((err,account)=>{
				let transporter = nodemailer.createTransport({
					service: "Gmail",
					auth: {
						user: "pharmatrack2k18@gmail.com",
						pass: "pharmatracc"
			  		}
				});

				let mailOptions = {
					from:'"Pharma Track" <pharmatrack2k18@gmail.com>',
					to: "pharmatrack2k18@gmail.com",
					subject: "Problem Report",
					text: body
				};

				transporter.sendMail(mailOptions, (error, info) => {
					if(error){
						console.log(error)
						return console.log(error);
					}
					console.log("Message sent: %s", info.messageId);
					console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
					});
				});
						////////////////////////////email
		},


	}
})();
