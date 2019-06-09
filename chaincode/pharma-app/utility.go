package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

//checks if an asset exists against an assetID
func checkAsset(APIstub shim.ChaincodeStubInterface, ID string) bool {
	assetAsBytes, _ := APIstub.GetState(ID)
	if assetAsBytes == nil {
		return false
	}
	return true
}

//checks if a user exists against a userID
func checkOwner(APIstub shim.ChaincodeStubInterface, ID string) bool {
	ownerAsBytes, _ := APIstub.GetState(ID)
	if ownerAsBytes == nil {
		return false
	}
	return true
}
