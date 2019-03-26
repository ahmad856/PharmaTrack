// SPDX-License-Identifier: Apache-2.0

/*
  Sample Chaincode based on Demonstrated Scenario

 This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go
*/

package main

/* Imports
* 4 utility libraries for handling bytes, reading and writing JSON,
formatting, and string manipulation
* 2 specific Hyperledger Fabric specific libraries for Smart Contracts
*/
import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/* Define PharmaAsset structure, with 4 properties.
Structure tags are used by encoding/json library
*/
type PharmaAsset struct {
	ID              string  `json:"id"`
	QRCode          string  `json:"qr"`
	Name            string  `json:"name"`
	Description     string  `json:"description"`
	AssetType       string  `json:"type"`
	Price           float32 `json:"price"`
	ManufactureDate string  `json:"manufactureDate"`
	ExpiryDate      string  `json:"expiryDate"`
	Quantity        int     `json:"quantity"`
	Timestamp       uint64  `json:"timestamp"`
	Owner           string  `json:"owner"`
}

type Manufacturer struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Address       string `json:"address"`
	LicenseNumber string `json:"license"`
	Password      string `json:"password"`
	OwnerName     string `json:"ownername"`
	OwnerCNIC     string `json:"ownercnic"`
	OwnerAddress  string `json:"owneraddress"`

	Distributors []string `json:"distributors"`
}

type Distributor struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Address       string `json:"address"`
	LicenseNumber string `json:"license"`
	Password      string `json:"password"`
	OwnerName     string `json:"ownername"`
	OwnerCNIC     string `json:"ownercnic"`
	OwnerAddress  string `json:"owneraddress"`

	Chemists []string `json:"chemists"`
}

type Chemist struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Address       string `json:"address"`
	LicenseNumber string `json:"license"`
	Password      string `json:"password"`
	OwnerName     string `json:"ownername"`
	OwnerCNIC     string `json:"ownercnic"`
	OwnerAddress  string `json:"owneraddress"`
}

type Transaction struct {
}

type TransactionHistory struct {
	TransID string      `json:"txid"`
	Asset   PharmaAsset `json:"asset"`
}

type StaticVariables struct {
	ManufacturerCount int `json:"manufacturercount"`
	DistributorCount  int `json:"distributorcount"`
	ChemistCount      int `json:"chemistcount"`
}

/*
 * The Init method *
 called when the Smart Contract "asset-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function
 -- see initLedger()
*/
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "Asset-chaincode"
 The app also specifies the specific smart contract function to call with args
*/
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "queryAsset" {
		return s.queryAsset(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "queryUser" {
		return s.queryUser(APIstub, args)
	} else if function == "recordAsset" {
		return s.recordAsset(APIstub, args)
	} else if function == "queryAllAssets" {
		return s.queryAllAssets(APIstub)
	} else if function == "recordManufacturer" {
		return s.recordManufacturer(APIstub, args)
	} else if function == "recordDistributor" {
		return s.recordDistributor(APIstub, args)
	} else if function == "recordChemist" {
		return s.recordChemist(APIstub, args)
	} else if function == "getTransactionHistory" {
		return s.getTransactionHistory(APIstub, args)
	} else if function == "makeTransaction" {
		return s.makeTransaction(APIstub, args)
	} else if function == "changeAssetOwner" {
		return s.changeAssetOwner(APIstub, args)
	} else if function == "initializeCounters" {
		return s.initializeCounters(APIstub)
	} else if function == "readAllUsers" {
		return s.readAllUsers(APIstub)
	} else if function == "getStaticVariables" {
		return s.getStaticVariables(APIstub)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*
 * The initLedger method *
Will add test data (10 assets)to our network
*/
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	assets := []PharmaAsset{
		PharmaAsset{ID: "1", QRCode: "abcdf", Name: "Panadol", Description: "This is a description of medicine", Owner: "manuf1", AssetType: "Medicine", Price: 40.9, ManufactureDate: "10-01-2008", ExpiryDate: "10-01-2009", Quantity: 54, Timestamp: 1504054225},
		PharmaAsset{ID: "2", QRCode: "ghijk", Name: "Xyzal", Description: "This is a description of medicine", Owner: "manuf1", AssetType: "Medicine", Price: 50.8, ManufactureDate: "10-01-2008", ExpiryDate: "10-01-2009", Quantity: 54, Timestamp: 1504054225},
		PharmaAsset{ID: "3", QRCode: "lmnop", Name: "Castine", Description: "This is a description of medicine", Owner: "manuf0", AssetType: "Medicine", Price: 10, ManufactureDate: "10-01-2008", ExpiryDate: "10-01-2009", Quantity: 54, Timestamp: 1504054225},
		PharmaAsset{ID: "4", QRCode: "qrstu", Name: "Calpol", Description: "This is a description of medicine", Owner: "manuf0", AssetType: "Medicine", Price: 20, ManufactureDate: "10-01-2008", ExpiryDate: "10-01-2009", Quantity: 54, Timestamp: 1504054225},
		PharmaAsset{ID: "5", QRCode: "vwxyz", Name: "Forceps", Description: "This is a description of surgical instrument", Owner: "manuf0", AssetType: "Surgical Instrument", Price: 40, ManufactureDate: "10-01-2008", ExpiryDate: "10-01-2009", Quantity: 54, Timestamp: 1504054225},
		PharmaAsset{ID: "6", QRCode: "abcdf", Name: "Scissors", Description: "This is a description of surgical instrument", Owner: "manuf0", AssetType: "Surgical Instrument", Price: 70.5, ManufactureDate: "10-01-2008", ExpiryDate: "10-01-2009", Quantity: 54, Timestamp: 1504054225},
	}

	manufacturers := []Manufacturer{
		Manufacturer{ID: "manuf0", Name: "Super Manufacturer", Address: "Islamabad", LicenseNumber: "isb123", Password: "123", OwnerName: "Ahmad", OwnerCNIC: "35201-111111-1", OwnerAddress: "3-B wapda town"},
	}

	distributors := []Distributor{
		Distributor{ID: "dist0", Name: "Excellent Distributor", Address: "Lahore", LicenseNumber: "lhe345", Password: "456", OwnerName: "Abdullah", OwnerCNIC: "35201-222222-2", OwnerAddress: "3-C angoori bagh"},
	}

	chemists := []Chemist{
		Chemist{ID: "chem0", Name: "Sasta Chemist", Address: "Lahore", LicenseNumber: "lea898", Password: "789", OwnerName: "Usama", OwnerCNIC: "35201-333333-3", OwnerAddress: "2-K sabzazar"},
	}

	i := 0
	for i < len(manufacturers) {
		fmt.Println("i is ", i)
		ownerAsBytes, _ := json.Marshal(manufacturers[i])
		APIstub.PutState(manufacturers[i].ID, ownerAsBytes)
		fmt.Println("Added", manufacturers[i])
		i = i + 1
	}

	i = 0
	for i < len(distributors) {
		fmt.Println("i is ", i)
		ownerAsBytes, _ := json.Marshal(distributors[i])
		APIstub.PutState(distributors[i].ID, ownerAsBytes)
		fmt.Println("Added", distributors[i])
		i = i + 1
	}

	i = 0
	for i < len(chemists) {
		fmt.Println("i is ", i)
		ownerAsBytes, _ := json.Marshal(chemists[i])
		APIstub.PutState(chemists[i].ID, ownerAsBytes)
		fmt.Println("Added", chemists[i])
		i = i + 1
	}

	i = 0
	for i < len(assets) {
		fmt.Println("i is ", i)
		assetAsBytes, _ := json.Marshal(assets[i])
		APIstub.PutState(strconv.Itoa(i+1), assetAsBytes)
		fmt.Println("Added", assets[i])
		i = i + 1
	}

	var statics = StaticVariables{ManufacturerCount: 1, DistributorCount: 1, ChemistCount: 1}

	staticsAsBytes, _ := json.Marshal(statics)
	error := APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to initialize counters"))
	}

	return shim.Success(nil)
}

/*
 * main function *
calls the Start function
The main function starts the chaincode in the container during instantiation.
*/
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
