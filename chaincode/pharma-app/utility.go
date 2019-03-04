package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func checkAsset(APIstub shim.ChaincodeStubInterface, ID string) bool {
	_, err := APIstub.GetState(ID)
	if err != nil {
		return true
	} else {
		return false
	}
}

func checkOwner(APIstub shim.ChaincodeStubInterface, ID string) bool {
	_, err := APIstub.GetState(ID)
	if err != nil {
		return true
	} else {
		return false
	}
}