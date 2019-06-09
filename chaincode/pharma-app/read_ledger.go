package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// function to get the static counts
//takes no parameters
func (s *SmartContract) getStaticVariables(APIstub shim.ChaincodeStubInterface) sc.Response {

	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function getStaticVariables: Statics not found.")
	}
	return shim.Success(staticsAsBytes)
}



/////////////////////////////////////////////////////////
//INITIAL FUNCTIONS
// called when a user signs in to fill data tables required
///////////////////////////////////////////////////////

//FOR ADMIN

// returns all manufacturers, distributors, chemists and admins, plus the admin logs
// takes no parameters
func (s *SmartContract) readAllUsers(APIstub shim.ChaincodeStubInterface) sc.Response {
	type Users struct {
		Manufacturers []Manufacturer `json:"manufacturers"`
		Distributors  []Distributor  `json:"distributors"`
		Chemists      []Chemist      `json:"chemists"`
		Admins        []Admin        `json:"admins"`
		AdminLogs     []AdminLog        `json:"adminlogs"`

	}
	var allUsers Users
	var statics StaticVariables

	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function readAllUsers: Statics not found.")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()


	manufid := 0
	for manufid<statics.ManufacturerCount {

		manufAsBytes, _ := APIstub.GetState("manuf"+strconv.Itoa(manufid))
		if manufAsBytes == nil {
			return shim.Error("In function readAllUsers: A Manufacturer was not found.")
		}
		manuf := Manufacturer{}
		json.Unmarshal(manufAsBytes, &manuf)

		allUsers.Manufacturers = append(allUsers.Manufacturers, manuf)

		manufid += 1
	}
	fmt.Println("manufacturers array - ", allUsers.Manufacturers)

	distid := 0
	for distid<statics.DistributorCount {

		distAsBytes, _ := APIstub.GetState("dist"+strconv.Itoa(distid))
		if distAsBytes == nil {
			return shim.Error("In function readAllUsers: A Distributor was not found.")
		}
		dist := Distributor{}
		json.Unmarshal(distAsBytes, &dist)

		allUsers.Distributors = append(allUsers.Distributors, dist)

		distid += 1
	}
	fmt.Println("distributors array - ", allUsers.Distributors)

	chemid := 0
	for chemid<statics.ChemistCount {

		chemAsBytes, _ := APIstub.GetState("chem"+strconv.Itoa(chemid))
		if chemAsBytes == nil {
			return shim.Error("In function readAllUsers: A Chemist was not found.")
		}
		chem := Chemist{}
		json.Unmarshal(chemAsBytes, &chem)

		allUsers.Chemists = append(allUsers.Chemists, chem)

		chemid += 1
	}
	fmt.Println("chemists array - ", allUsers.Chemists)

	adminid := 0
	for adminid<statics.AdminCount {

		adminAsBytes, _ := APIstub.GetState("admin"+strconv.Itoa(adminid))
		if adminAsBytes == nil {
			return shim.Error("In function readAllUsers: An Admin was not found.")
		}
		admin := Admin{}
		json.Unmarshal(adminAsBytes, &admin)

		allUsers.Admins = append(allUsers.Admins, admin)

		adminid += 1
	}
	fmt.Println("admins array - ", allUsers.Admins)

	adminlogid := 0
	for adminlogid<statics.AdminLogCount {

		adminlogAsBytes, _ := APIstub.GetState("adminlog"+strconv.Itoa(adminlogid))
		if adminlogAsBytes == nil {
			return shim.Error("In function readAllUsers: An Admin Log was not found.")
		}
		adminlog := AdminLog{}
		json.Unmarshal(adminlogAsBytes, &adminlog)

		allUsers.AdminLogs = append(allUsers.AdminLogs, adminlog)

		adminlogid += 1
	}
	fmt.Println("admin logs array - ", allUsers.AdminLogs)



	//change to array of bytes
	usersAsBytes, _ := json.Marshal(allUsers) //convert to array of bytes
	return shim.Success(usersAsBytes)
}

// returns all distributors
// takes no parameters
func (s *SmartContract) readAllDistributors(APIstub shim.ChaincodeStubInterface) sc.Response {
	type Users struct {
		Distributors  []Distributor  `json:"distributors"`

	}
	var allUsers Users
	var statics StaticVariables

	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function readAllUsers: Statics not found.")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()


	distid := 0
	for distid<statics.DistributorCount {

		distAsBytes, _ := APIstub.GetState("dist"+strconv.Itoa(distid))
		if distAsBytes == nil {
			return shim.Error("In function readAllDistributors: A Distributor was not found.")
		}
		dist := Distributor{}
		json.Unmarshal(distAsBytes, &dist)

		allUsers.Distributors = append(allUsers.Distributors, dist)

		distid += 1
	}
	fmt.Println("distributors array - ", allUsers.Distributors)

	//change to array of bytes
	usersAsBytes, _ := json.Marshal(allUsers) //convert to array of bytes
	return shim.Success(usersAsBytes)
}

// returns all chemists
// takes no parameters
func (s *SmartContract) readAllChemists(APIstub shim.ChaincodeStubInterface) sc.Response {
	type Users struct {
		Chemists  []Chemist  `json:"chemists"`

	}
	var allUsers Users
	var statics StaticVariables

	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function readAllUsers: Statics not found.")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()


	chemid := 0
	for chemid<statics.ChemistCount {

		chemAsBytes, _ := APIstub.GetState("chem"+strconv.Itoa(chemid))
		if chemAsBytes == nil {
			return shim.Error("In function readAllChemists: A Chemist was not found.")
		}
		chem := Chemist{}
		json.Unmarshal(chemAsBytes, &chem)

		allUsers.Chemists = append(allUsers.Chemists, chem)

		chemid += 1
	}
	fmt.Println("chemists array - ", allUsers.Chemists)

	//change to array of bytes
	usersAsBytes, _ := json.Marshal(allUsers) //convert to array of bytes
	return shim.Success(usersAsBytes)
}



//FOR MANUF

// returns the distributors, products and assets enrolled to a certain manufacturer
// takes 1 parameter
// args[0] = manufacturer ID
func (s *SmartContract) initialReadManufacturer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("In function initialReadManufacturer: Incorrect number of arguments. Expecting 1.")
	}

	if !strings.HasPrefix(args[0], "manuf") {
		return shim.Error("In function initialReadManufacturer: Manufacturer ID provided is not valid. Manufacturer IDs start with 'manuf'.")
	}

	manufAsBytes, _ := APIstub.GetState(args[0])
	if manufAsBytes == nil {
		return shim.Error("In function initialReadManufacturer: Given Manufacturer not found.")
	}

	current := Manufacturer{}
	json.Unmarshal(manufAsBytes, &current)


	type InitialManuf struct {
		Distributors  []Distributor  `json:"distributors"`
		Products		[]Product 		`json:"products"`

		PharmaAssets	[]PharmaAsset 		`json:"pharmaassets"`

	}

	var data InitialManuf

	for _, distid := range current.Distributors {

			distAsBytes, _ := APIstub.GetState(distid)
			if distAsBytes == nil {
				return shim.Error("In function initialReadManufacturer: A Distributor was not found.")
			}
			dist := Distributor{}
			json.Unmarshal(distAsBytes, &dist)

			if dist.Suspended==false {
				data.Distributors = append(data.Distributors, dist)
			}

	}
	for _, prodid := range current.Products {

			prodAsBytes, _ := APIstub.GetState(prodid)
			if prodAsBytes == nil {
				return shim.Error("In function initialReadManufacturer: A Product was not found.")
			}
			prod := Product{}
			json.Unmarshal(prodAsBytes, &prod)

			data.Products = append(data.Products, prod)

	}
	for _, assetid := range current.Assets {

			assetAsBytes, _ := APIstub.GetState(assetid)
			if assetAsBytes == nil {
				return shim.Error("In function initialReadManufacturer: An Asset was not found."+assetid)
			}

			asset := PharmaAsset{}
			json.Unmarshal(assetAsBytes, &asset)
			data.PharmaAssets = append(data.PharmaAssets, asset)

	}



	//change to array of bytes
	dataAsBytes, _ := json.Marshal(data) //convert to array of bytes
	return shim.Success(dataAsBytes)
}


//FOR DIST

// returns the chemists and assets enrolled to a certain distributor
// takes 1 parameter
// args[0] = distributor ID
func (s *SmartContract) initialReadDistributor(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("In function initialReadDistributor: Incorrect number of arguments. Expecting 1.")
	}

	if !strings.HasPrefix(args[0], "dist") {
		return shim.Error("In function initialReadDistributor: Distributor ID provided is not valid. Distributor IDs start with 'dist'.")
	}

	distAsBytes, _ := APIstub.GetState(args[0])
	if distAsBytes == nil {
		return shim.Error("In function initialReadDistributor: Given Distributor not found.")
	}

	current := Distributor{}
	json.Unmarshal(distAsBytes, &current)


	type InitialDist struct {
		Chemists 		 []Chemist  `json:"chemists"`

		PharmaAssets	[]PharmaAsset 		`json:"pharmaassets"`

	}

	var data InitialDist

	for _, chemid := range current.Chemists {

			chemAsBytes, _ := APIstub.GetState(chemid)
			if chemAsBytes == nil {
				return shim.Error("In function initialReadDistributor: A Chemist was not found.")
			}
			chem := Chemist{}
			json.Unmarshal(chemAsBytes, &chem)

			if chem.Suspended==false {
				data.Chemists = append(data.Chemists, chem)
			}

	}

	for _, assetid := range current.Assets {

			assetAsBytes, _ := APIstub.GetState(assetid)
			if assetAsBytes == nil {
				return shim.Error("In function initialReadDistributor: An Asset was not found.")
			}

			asset := PharmaAsset{}
			json.Unmarshal(assetAsBytes, &asset)
			data.PharmaAssets = append(data.PharmaAssets, asset)

	}



	//change to array of bytes
	dataAsBytes, _ := json.Marshal(data) //convert to array of bytes
	return shim.Success(dataAsBytes)
}


//FOR CHEM

// returns the assets enrolled to a certain chemist
// takes 1 parameter
// args[0] = chemist ID
func (s *SmartContract) initialReadChemist(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("In function initialReadChemist: Incorrect number of arguments. Expecting 1.")
	}

	if !strings.HasPrefix(args[0], "chem") {
		return shim.Error("In function initialReadChemist: Chemist ID provided is not valid. Chemist IDs start with 'chem'.")
	}

	chemAsBytes, _ := APIstub.GetState(args[0])
	if chemAsBytes == nil {
		return shim.Error("In function initialReadChemist: Given Chemist not found.")
	}

	current := Chemist{}
	json.Unmarshal(chemAsBytes, &current)


	type InitialChem struct {

		PharmaAssets	[]PharmaAsset 		`json:"pharmaassets"`

	}

	var data InitialChem

	for _, assetid := range current.Assets {

			assetAsBytes, _ := APIstub.GetState(assetid)
			if assetAsBytes == nil {
				return shim.Error("In function initialReadChemist: An Asset was not found.")
			}

			asset := PharmaAsset{}
			json.Unmarshal(assetAsBytes, &asset)
			data.PharmaAssets = append(data.PharmaAssets, asset)

	}




	//change to array of bytes
	dataAsBytes, _ := json.Marshal(data) //convert to array of bytes
	return shim.Success(dataAsBytes)
}



////////////////////////////////////////////////////////////////////////////////////

/*
 * The queryAsset method *
Used to view the records of one particular asset
It takes one argument -- the key for the Asset in question
*/

func (s *SmartContract) queryAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("In function queryAsset: Incorrect number of arguments. Expecting 1.")
	}

	assetAsBytes, _ := APIstub.GetState(args[0])
	if assetAsBytes == nil {
		return shim.Error("In function queryAsset: Asset not found.")
	}
	return shim.Success(assetAsBytes)
}

/*
 * The login method *
 returns user object for a userid, does not return a suspended user
It takes one argument -- the key for the User in question
*/

func (s *SmartContract) login(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("In function login: Incorrect number of arguments. Expecting 1.")
	}
	if !(strings.HasPrefix(args[0], "admin") || strings.HasPrefix(args[0], "manuf") || strings.HasPrefix(args[0], "dist") || strings.HasPrefix(args[0], "chem")) {
		return shim.Error("In function login: Invalid User ID. User IDs start with 'admin', 'manuf', 'dist' or 'chem'.")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	if userAsBytes == nil {
		return shim.Error("In function login: User not found.")
	}

	user := User{}
	json.Unmarshal(userAsBytes, &user)

	if user.Suspended==true {
		return shim.Error("In function login: This User has been suspended by an Admin.")
	}

	return shim.Success(userAsBytes)
}


//returns complete history for a given asset ID
// takes 1 argument, the asset ID
func (s *SmartContract) getTransactionHistory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	var history []TransactionHistory
	var asset PharmaAsset

	iterator, err := APIstub.GetHistoryForKey(args[0])
	if err != nil {
		return shim.Error("Error getting history.")
	}
	defer iterator.Close()

	for iterator.HasNext() {
		historyItem, err := iterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		if historyItem == nil {
			return shim.Error("History Item is Null.")
		}

		var tempHistoryItem TransactionHistory
		tempHistoryItem.TransID = historyItem.TxId
		json.Unmarshal(historyItem.Value, &asset)
		if historyItem.Value == nil {
			var emptyAsset PharmaAsset
			tempHistoryItem.Asset = emptyAsset
		} else {
			json.Unmarshal(historyItem.Value, &asset)
			tempHistoryItem.Asset = asset
		}
		history = append(history, tempHistoryItem)
	}
	historyAsBytes, _ := json.Marshal(history)
	return shim.Success(historyAsBytes)
}


