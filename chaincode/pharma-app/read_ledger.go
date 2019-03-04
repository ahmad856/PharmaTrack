package main

import (
	"encoding/json"
	"fmt"
	"bytes"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)


/*
 * The queryMedicine method *
Used to view the records of one particular asset
It takes one argument -- the key for the medicine in question
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
 * The queryOwner method *
Used to view the records of one particular medicine
It takes one argument -- the key for the owner in question
 */

func (s *SmartContract) queryOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	ownerAsBytes, _ := APIstub.GetState(args[0])
	if ownerAsBytes == nil {
		return shim.Error("Could not locate medicine")
	}
	return shim.Success(ownerAsBytes)
}


/*
 * The queryAllMedicines method *
allows for assessing all the records added to the ledger(all medicines)
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

	fmt.Printf("- queryAllMedicines:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) getTransactionHistory(APIstub shim.ChaincodeStubInterface, args[]string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	var history []TransactionHistory;
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
