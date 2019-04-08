package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

func (s *SmartContract) getStaticVariables(APIstub shim.ChaincodeStubInterface) sc.Response {

	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("GetStaticVariables: Could not locate asset")
	}
	return shim.Success(staticsAsBytes)
}

func (s *SmartContract) readAllUsers(APIstub shim.ChaincodeStubInterface) sc.Response {
	type Users struct {
		Manufacturers []Manufacturer `json:"manufacturers"`
		Distributors  []Distributor  `json:"distributors"`
		Chemists      []Chemist      `json:"chemists"`
	}
	var allUsers Users
	var statics StaticVariables

	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("func: readAllUser... Could not get static variables")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	if statics.ManufacturerCount > 0 {

		// ---- Get All Manufacturers ---- //
		resultsIterator, err := APIstub.GetStateByRange("manuf0", "manuf"+strconv.Itoa(statics.ManufacturerCount))
		if err != nil {
			return shim.Error(err.Error())
		}
		defer resultsIterator.Close()

		for resultsIterator.HasNext() {
			aKeyValue, err := resultsIterator.Next()
			if err != nil {
				return shim.Error(err.Error())
			}
			queryKeyAsStr := aKeyValue.Key
			queryValAsBytes := aKeyValue.Value
			fmt.Println("on manufacturer id - ", queryKeyAsStr)
			var manuf Manufacturer
			json.Unmarshal(queryValAsBytes, &manuf)                        //un stringify it aka JSON.parse()
			allUsers.Manufacturers = append(allUsers.Manufacturers, manuf) //add this manuf to the list
		}
		fmt.Println("manufacturers array - ", allUsers.Manufacturers)

	} else {
		return shim.Error("func: readAllUser... no manufacturers")
	}

	if statics.DistributorCount > 0 {

		// ---- Get All Distributors ---- //
		resultsIterator, err := APIstub.GetStateByRange("dist0", "dist"+strconv.Itoa(statics.DistributorCount))
		if err != nil {
			return shim.Error(err.Error())
		}
		defer resultsIterator.Close()

		for resultsIterator.HasNext() {
			aKeyValue, err := resultsIterator.Next()
			if err != nil {
				return shim.Error(err.Error())
			}
			queryKeyAsStr := aKeyValue.Key
			queryValAsBytes := aKeyValue.Value
			fmt.Println("on distributor id - ", queryKeyAsStr)
			var dist Distributor
			json.Unmarshal(queryValAsBytes, &dist)                      //un stringify it aka JSON.parse()
			allUsers.Distributors = append(allUsers.Distributors, dist) //add this dist to the list
		}
		fmt.Println("distributors array - ", allUsers.Distributors)

	} else {
		return shim.Error("func: readAllUser... no distributors")
	}

	if statics.ChemistCount > 0 {

		// ---- Get All chemists ---- //
		resultsIterator, err := APIstub.GetStateByRange("chem0", "chem"+strconv.Itoa(statics.ChemistCount))
		if err != nil {
			return shim.Error(err.Error())
		}
		defer resultsIterator.Close()

		for resultsIterator.HasNext() {
			aKeyValue, err := resultsIterator.Next()
			if err != nil {
				return shim.Error(err.Error())
			}
			queryKeyAsStr := aKeyValue.Key
			queryValAsBytes := aKeyValue.Value
			fmt.Println("on chemist id - ", queryKeyAsStr)
			var chem Chemist
			json.Unmarshal(queryValAsBytes, &chem)              //un stringify it aka JSON.parse()
			allUsers.Chemists = append(allUsers.Chemists, chem) //add this chem to the list
		}
		fmt.Println("chemists array - ", allUsers.Chemists)

	} else {
		return shim.Error("func: readAllUser... no chemists")
	}

	//change to array of bytes
	usersAsBytes, _ := json.Marshal(allUsers) //convert to array of bytes
	return shim.Success(usersAsBytes)
}

/*
 * The queryAsset method *
Used to view the records of one particular asset
It takes one argument -- the key for the Asset in question
*/

func (s *SmartContract) queryAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	assetAsBytes, _ := APIstub.GetState(args[0])
	if assetAsBytes == nil {
		return shim.Error("Could not locate asset")
	}
	return shim.Success(assetAsBytes)
}

/*
 * The queryUser method *
Used to view the records of one particular user
It takes one argument -- the key for the User in question
*/

func (s *SmartContract) queryUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	if userAsBytes == nil {
		return shim.Error("Could not locate user")
	}
	return shim.Success(userAsBytes)
}

/*
 * The queryOwner method *
Used to view the records of one particular Asset
It takes one argument -- the key for the owner in question
*/

func (s *SmartContract) queryOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	ownerAsBytes, _ := APIstub.GetState(args[0])
	if ownerAsBytes == nil {
		return shim.Error("Could not locate asset")
	}
	return shim.Success(ownerAsBytes)
}

/*
 * The queryAllAssets method *
allows for assessing all the records added to the ledger(all assets)
This method does not take any arguments. Returns JSON string containing results.
*/

func (s *SmartContract) queryAllAssets(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllAssets:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) getTransactionHistory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	var history []TransactionHistory
	var asset PharmaAsset

	iterator, err := APIstub.GetHistoryForKey(args[0])
	if err != nil {
		return shim.Error("Error getting history")
	}
	defer iterator.Close()

	for iterator.HasNext() {
		historyItem, err := iterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		if historyItem == nil {
			return shim.Error("history item is null")
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

////////////////////////////////////////read Distributors
func (s *SmartContract) readAllDistributors(APIstub shim.ChaincodeStubInterface) sc.Response {
	type Users struct {
		Distributors  []Distributor  `json:"distributors"`
	}
	var allDist Users
	var statics StaticVariables

	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("func: readAllUser... Could not get static variables")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	if statics.DistributorCount > 0 {
		// ---- Get All Distributors ---- //
		resultsIterator, err := APIstub.GetStateByRange("dist0", "dist"+strconv.Itoa(statics.DistributorCount))
		if err != nil {
			return shim.Error(err.Error())
		}
		defer resultsIterator.Close()

		for resultsIterator.HasNext() {
			aKeyValue, err := resultsIterator.Next()
			if err != nil {
				return shim.Error(err.Error())
			}
			queryKeyAsStr := aKeyValue.Key
			queryValAsBytes := aKeyValue.Value
			fmt.Println("on distributor id - ", queryKeyAsStr)
			var dist Distributor
			json.Unmarshal(queryValAsBytes, &dist)                      //un stringify it aka JSON.parse()
			allDist.Distributors = append(allDist.Distributors, dist) //add this dist to the list
		}
		fmt.Println("distributors array - ", allDist.Distributors)

	} else {
		return shim.Error("func: readAllDistributors... no distributors")
	}

	//change to array of bytes
	usersAsBytes, _ := json.Marshal(allDist) //convert to array of bytes
	return shim.Success(usersAsBytes)
}

////////////////////////////////////////read Chemist
func (s *SmartContract) readAllChemists(APIstub shim.ChaincodeStubInterface) sc.Response {
	type Users struct {
		Chemists  []Chemist  `json:"chemists"`
	}
	var allChem Users
	var statics StaticVariables

	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("func: readAllUser... Could not get static variables")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	if statics.ChemistCount > 0 {
		// ---- Get All Chemist ---- //
		resultsIterator, err := APIstub.GetStateByRange("chem0", "chem"+strconv.Itoa(statics.ChemistCount))
		if err != nil {
			return shim.Error(err.Error())
		}
		defer resultsIterator.Close()

		for resultsIterator.HasNext() {
			aKeyValue, err := resultsIterator.Next()
			if err != nil {
				return shim.Error(err.Error())
			}
			queryKeyAsStr := aKeyValue.Key
			queryValAsBytes := aKeyValue.Value
			fmt.Println("on chemist id - ", queryKeyAsStr)
			var chem Chemist
			json.Unmarshal(queryValAsBytes, &chem)                      //un stringify it aka JSON.parse()
			allChem.Chemists = append(allChem.Chemists, chem) //add this chem to the list
		}
		fmt.Println("chemists array - ", allChem.Chemists)

	} else {
		return shim.Error("func: readAllChemists... no Chemist")
	}

	//change to array of bytes
	usersAsBytes, _ := json.Marshal(allChem) //convert to array of bytes
	return shim.Success(usersAsBytes)
}
