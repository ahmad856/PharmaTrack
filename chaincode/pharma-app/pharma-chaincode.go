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

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/* Define PharmaAsset structure, with 4 properties.
Structure tags are used by encoding/json library
*/




type Batch struct {

	ID              string  `json:"id"`

	ProductID 		string `json:"productid"`
	ProductName 		string `json:"productname"`

	ManufactureDate string  `json:"manufactureDate"`
	ExpiryDate      string  `json:"expiryDate"`

	CartonQuantity        int     `json:"cartonquantity"`

	Owner 		string `json:"owner"`
	OwnerName 		string `json:"ownername"`

}
type Carton struct {

	ID              string  `json:"id"`

	ProductID 		string `json:"productid"`
	ProductName 		string `json:"productname"`

	ManufactureDate string  `json:"manufactureDate"`
	ExpiryDate      string  `json:"expiryDate"`

	Owner 		string `json:"owner"`
	OwnerName 		string `json:"ownername"`

}
type Packet struct {

	ID              string  `json:"id"`

	ProductID 		string `json:"productid"`
	ProductName 		string `json:"productname"`

	ManufactureDate string  `json:"manufactureDate"`
	ExpiryDate      string  `json:"expiryDate"`

	Owner 		string `json:"owner"`
	OwnerName 		string `json:"ownername"`

	Customer 		CustomerRelation 		`json:"customer"`

}
type PharmaAsset struct {

	ID              string  `json:"id"`

	ProductID 		string `json:"productid"`
	ProductName 		string `json:"productname"`

	ManufactureDate string  `json:"manufactureDate"`
	ExpiryDate      string  `json:"expiryDate"`

	Owner 		string `json:"owner"`
	OwnerName 		string `json:"ownername"`

	Customer 		CustomerRelation 		`json:"customer"`

}

type CustomerRelation struct {
	Name        string `json:"name"`
	PhoneNumber string `json:"phone"`
	Timestamp   string `json:"timestamp"`
}


type Product struct {

	ID             			 		string  `json:"id"`
	Name            				string  `json:"name"`
	AssetType	 			 	     string  `json:"type"`
	Description     				string  `json:"description"`
	RetailPrice           			float32 `json:"retailprice"`
	UnitQuantity           			int `json:"unitquantity"`

	CartonCapacity           		int `json:"cartoncapacity"`
	PacketCapacity					int `json:"packetcapacity"`

	ManufacturerID            		string `json:"manufacturerid"`

}




type Admin struct {

	ID       string `json:"id"`
	Name 		string `json:"name"`
	Password string `json:"password"`
	CNIC 		string `json:"cnic"`

	Email 		string `json:"email"`

	Suspended 	bool	`json:"suspended"`

}
type AdminLog struct {

	ID       string `json:"id"`

	AdminID       string `json:"adminid"`
	AdminName 		string `json:"adminname"`
	Description 		string `json:"description"`

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

	Email 		string `json:"email"`

	Products 		[]string `json:"products"`

	BatchCount      int `json:"batchcount"`

	Distributors 	[]string `json:"distributors"`

	Assets 			[]string `json:"assets"`

	Suspended 	bool	`json:"suspended"`

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

	Email 		string `json:"email"`

	Chemists []string `json:"chemists"`

	Assets []string `json:"assets"`

	Suspended 	bool	`json:"suspended"`

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

	Email 		string `json:"email"`

	Assets []string `json:"assets"`

	Suspended 	bool	`json:"suspended"`

}

type User struct {

	ID            string `json:"id"`
	Name          string `json:"name"`
	Address       string `json:"address"`
	LicenseNumber string `json:"license"`
	Password      string `json:"password"`
	OwnerName     string `json:"ownername"`
	OwnerCNIC     string `json:"ownercnic"`
	OwnerAddress  string `json:"owneraddress"`

	Email 		string `json:"email"`

	CNIC 		string `json:"cnic"`	//from Admin


	Products 		[]string `json:"products"`		//from Manufacturer

	BatchCount      int `json:"batchcount"`		//from Manufacturer

	Distributors []string `json:"distributors"`		//from Manufacturer
	Chemists     []string     `json:"chemists"`		//from Distributor

	Assets []string `json:"assets"`

	Suspended 	bool	`json:"suspended"`

}


type TransactionHistory struct {
	TransID string      `json:"txid"`
	Asset   PharmaAsset `json:"asset"`
	OwnerName string 	`json:"ownername"`
}

type StaticVariables struct {
	ManufacturerCount int `json:"manufacturercount"`
	DistributorCount  int `json:"distributorcount"`
	ChemistCount      int `json:"chemistcount"`
	AdminCount      int `json:"admincount"`
	AdminLogCount      int `json:"adminlogcount"`
	ProductCount      int `json:"productcount"`

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
	if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "getStaticVariables" {
		return s.getStaticVariables(APIstub)
	} else if function == "readAllUsers" {
		return s.readAllUsers(APIstub)
	} else if function == "queryAsset" {
		return s.queryAsset(APIstub, args)
	} else if function == "login" {
		return s.login(APIstub, args)
	} else if function == "getTransactionHistory" {
		return s.getTransactionHistory(APIstub, args)
	} else if function == "toggleSuspendUser" {
		return s.toggleSuspendUser(APIstub, args)
	} else if function == "updateAdmin" {
		return s.updateAdmin(APIstub, args)
	} else if function == "createAdmin" {
		return s.createAdmin(APIstub, args)
	} else if function == "recordManufacturer" {
		return s.recordManufacturer(APIstub, args)
	} else if function == "recordDistributor" {
		return s.recordDistributor(APIstub, args)
	} else if function == "recordChemist" {
		return s.recordChemist(APIstub, args)
	} else if function == "enrollChemist" {
		return s.enrollChemist(APIstub, args)
	} else if function == "enrollDistributor" {
		return s.enrollDistributor(APIstub, args)
	} else if function == "initializeCounters" {
		return s.initializeCounters(APIstub)
	} else if function == "createProduct" {
		return s.createProduct(APIstub, args)
	} else if function == "updateProduct" {
		return s.updateProduct(APIstub, args)
	} else if function == "createBatch" {
		return s.createBatch(APIstub, args)
	} else if function == "updateUser" {
		return s.updateUser(APIstub, args)
	} else if function == "changeAssetOwner" {
		return s.changeAssetOwner(APIstub, args)
	} else if function == "sellAsset" {
		return s.sellAsset(APIstub, args)
	} else if function == "returnAsset" {
		return s.returnAsset(APIstub, args)
	} else if function == "initialReadManufacturer" {
		return s.initialReadManufacturer(APIstub, args)
	} else if function == "initialReadDistributor" {
		return s.initialReadDistributor(APIstub, args)
	} else if function == "initialReadChemist" {
		return s.initialReadChemist(APIstub, args)
	} else if function == "readAllDistributors" {
		return s.readAllDistributors(APIstub)
	} else if function == "readAllChemists" {
		return s.readAllChemists(APIstub)
	}

	return shim.Error("In function Invoke: Invalid Smart Contract function name:"+function)
}

/*
 * The initLedger method *
Will add test data (10 assets)to our network
*/
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {

	manufacturers := []Manufacturer{
		Manufacturer{ID: "manuf0", Name: "Super Manufacturer", Address: "Islamabad", LicenseNumber: "isb123", Password: "123", OwnerName: "Ahmad", OwnerCNIC: "35201-111111-1", OwnerAddress: "3-B wapda town", Email: "ahmadshahid856@gmail.com", BatchCount: 0, Suspended: false},
	}

	distributors := []Distributor{
		Distributor{ID: "dist0", Name: "Excellent Distributor", Address: "Lahore", LicenseNumber: "lhe345", Password: "456", OwnerName: "Abdullah", OwnerCNIC: "35201-222222-2", OwnerAddress: "3-C angoori bagh", Email: "ahmadshahid856@gmail.com", Suspended: false},
	}

	chemists := []Chemist{
		Chemist{ID: "chem0", Name: "Aziz Pharmacy", Address: "Lahore", LicenseNumber: "lea898", Password: "789", OwnerName: "Aziz", OwnerCNIC: "35201-333333-3", OwnerAddress: "2-K sabzazar", Email: "ahmadshahid856@gmail.com", Suspended: false},
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


	var admin = Admin{ID: "admin0", Password: "admin", Name: "Abdullah Kamran", Email: "ahmadshahid856@gmail.com", CNIC:"42101-0339488-3"}

	adminAsBytes, _ := json.Marshal(admin)
	APIstub.PutState("admin0", adminAsBytes)


	//////////////////////////////LOGS/////////////////////////////////////////

	var adminlog = AdminLog{ID: "adminlog0", AdminID: "admin0", AdminName: "Abdullah Kamran", Description: "Created his own account to initialize ledger."}

	adminLogAsBytes, _ := json.Marshal(adminlog)
	APIstub.PutState("adminlog0", adminLogAsBytes)

	adminlog = AdminLog{ID: "adminlog1", AdminID: "admin0", AdminName: "Abdullah Kamran", Description: "Created an initial Manufacturer."}

	adminLogAsBytes, _ = json.Marshal(adminlog)
	APIstub.PutState("adminlog1", adminLogAsBytes)

	adminlog = AdminLog{ID: "adminlog2", AdminID: "admin0", AdminName: "Abdullah Kamran", Description: "Created an initial Distributor."}

	adminLogAsBytes, _ = json.Marshal(adminlog)
	APIstub.PutState("adminlog2", adminLogAsBytes)

	adminlog = AdminLog{ID: "adminlog3", AdminID: "admin0", AdminName: "Abdullah Kamran", Description: "Created an initial Chemist."}

	adminLogAsBytes, _ = json.Marshal(adminlog)
	APIstub.PutState("adminlog3", adminLogAsBytes)

//////////////////////////////////////////////////////////////////////////////////////////

	var statics = StaticVariables{ManufacturerCount: 1, DistributorCount: 1, ChemistCount: 1, AdminCount: 1, AdminLogCount: 4}

	staticsAsBytes, _ := json.Marshal(statics)
	APIstub.PutState("StaticVariables", staticsAsBytes)

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
		fmt.Printf("In function main: Error creating new Smart Contract: %s", err)
	}
}
