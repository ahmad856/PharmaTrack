package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func checkAsset(APIstub shim.ChaincodeStubInterface, ID string) bool {
	assetAsBytes, _ := APIstub.GetState(ID)
	if assetAsBytes == nil {
		return false
	}
	return true
}

func checkOwner(APIstub shim.ChaincodeStubInterface, ID string) bool {
	ownerAsBytes, _ := APIstub.GetState(ID)
	if ownerAsBytes == nil {
		return false
	}
	return true
}
