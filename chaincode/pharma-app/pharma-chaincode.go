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
	ID string `json:"id"`
	QRCode string `json:"qr"`
	Name string `json:"name"`
	Description string `json:"description"`
	AssetType string `json:"type"`
	Price float32 `json:"price"`
	ManufactureDate string `json:"manufactureDate"`
	ExpiryDate string `json:"expiryDate"`
	Quantity int `json:"quantity"`
	Timestamp uint64 `json:"timestamp"`
	Owner  string `json:"owner"`
}

type Manufacturer struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Address  string `json:"address"`
	Timestamp uint64 `json:"timestamp"`
}

type Distributor struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Address  string `json:"address"`
	Timestamp uint64 `json:"timestamp"`
}

type Chemist struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Address  string `json:"address"`
	Timestamp uint64 `json:"timestamp"`
}

type Transaction struct {
	
}

type TransactionHistory struct {
	TransID string `json:"txid"`
	Asset PharmaAsset `json:"asset"`
}

/*
 * The Init method *
 called when the Smart Contract "medicine-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function 
 -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "Medicine-chaincode"
 The app also specifies the specific smart contract function to call with args
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "queryMedicine" {
		return s.queryAsset(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordMedicine" {
		return s.recordAsset(APIstub, args)
	} else if function == "queryAllMedicines" {
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
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*
 * The initLedger method *
Will add test data (10 medicines)to our network
 */
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	assets := []PharmaAsset{
		PharmaAsset{ID: "asset1", QRCode: "abcdf", Name: "Panadol", Description: "This is a description", Owner: "owner1", AssetType: "Carton", Price: 40.9, ManufactureDate: "10-01-2008", ExpiryDate: "10-01-2009",  Quantity: 54, Timestamp: 1504054225},
	}

	manufacturers := []Manufacturer{
		Manufacturer{ID:"owner1", Name: "Abbot", Address: "Islamabad", Timestamp: 1550858400635},
	}

	i := 0
	for i < len(manufacturers) {
		fmt.Println("i is ", i)
		ownerAsBytes, _ := json.Marshal(manufacturers[i])
		APIstub.PutState("owner" + strconv.Itoa(i+1), ownerAsBytes)
		fmt.Println("Added", manufacturers[i])
		i = i + 1
	}

	i = 0
	for i < len(assets) {
		fmt.Println("i is ", i)
		medicineAsBytes, _ := json.Marshal(assets[i])
		APIstub.PutState("asset" + strconv.Itoa(i+1), medicineAsBytes)
		fmt.Println("Added", assets[i])
		i = i + 1
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