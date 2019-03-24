package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

/*
 * The recordAsset method *
Used to view the records of one particular asset
It takes 11 argument --
 -> the key for the asset to be created 					[0]
 -> QR code for the asset 									[1]
 -> Name of the asset 										[2]
 -> Description of the asset 								[3]
 -> Owner ID 												[4]
 -> Asset type of the asset like carton, pack 				[5]
 -> Price of single asset									[6]
 -> Manufacture date of the asset							[7]
 -> Expiry date of the asset								[8]
 -> Quantity in the packing unit 							[9]
 -> Timestamp for the creation of the asset					[10]
*/

func (s *SmartContract) recordAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 11 {
		return shim.Error("Incorrect number of arguments. Expecting 11")
	}

	if checkAsset(APIstub, args[0]) == true {
		return shim.Error("Asset already exists")
	}

	if checkOwner(APIstub, args[4]) != true {
		return shim.Error("Owner does not exist")
	}

	var price, err = strconv.ParseFloat(args[6], 32)
	if err != nil {
		fmt.Println(err)
	}
	var quantity, err1 = strconv.Atoi(args[9])
	if err1 != nil {
		fmt.Println(err1)
	}
	var timestamp, err2 = strconv.ParseUint(args[10], 10, 64)
	if err2 != nil {
		fmt.Println(err2)
	}

	var asseti = PharmaAsset{ID: args[0], QRCode: args[1], Name: args[2], Description: args[3], Owner: args[4], AssetType: args[5], Price: float32(price), ManufactureDate: args[7], ExpiryDate: args[8], Quantity: quantity, Timestamp: uint64(timestamp)}

	assetAsBytes, _ := json.Marshal(asseti)
	error := APIstub.PutState(args[0], assetAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to record asset: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The recordDistributor method *
Used to view the records of one particular asset
It takes 4 argument --
 -> the key for the Distributor to be created
 -> Name for the Distributor
 -> Address of the Distributor
 -> Timestamp the distributor was recorded
*/

func (s *SmartContract) recordDistributor(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	if checkOwner(APIstub, args[0]) == true {
		return shim.Error("Distributor already exists")
	}

	var distributor = Distributor{ID: args[0], Name: args[1], Address: args[3], UserName: args[4], Password: args[5]}

	distributorAsBytes, _ := json.Marshal(distributor)
	error := APIstub.PutState(args[0], distributorAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to record distributor: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The recordManufacturer method *
Used to view the records of one particular asset
It takes 4 argument --
 -> the key for the Manufacturer to be created
 -> Name for the Manufacturer
 -> Address of the Manufacturer
 -> Timestamp the Manufacturer was recorded
*/

func (s *SmartContract) recordManufacturer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	if checkOwner(APIstub, args[0]) == true {
		return shim.Error("Manufacturer already exists")
	}

	var manufacturer = Manufacturer{ID: args[0], Name: args[1], Address: args[3], UserName: args[4], Password: args[5]}

	manufacturerAsBytes, _ := json.Marshal(manufacturer)

	error := APIstub.PutState(args[0], manufacturerAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to record manufacturer: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The recordChemist method *
Used to view the records of one particular asset
It takes 4 argument --
 -> the key for the Chemist to be created
 -> Name for the Chemist
 -> Address of the Chemist
 -> Timestamp the Chemist was recorded
*/

func (s *SmartContract) recordChemist(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	if checkOwner(APIstub, args[0]) == true {
		return shim.Error("Chemist already exists")
	}

	var chemist = Chemist{ID: args[0], Name: args[1], Address: args[3], UserName: args[4], Password: args[5]}

	chemistAsBytes, _ := json.Marshal(chemist)
	error := APIstub.PutState(args[0], chemistAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to record chemist: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The changeAssetOwner method *
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, asset id and new owner name.
*/

func (s *SmartContract) changeAssetOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	assetAsBytes, _ := APIstub.GetState(args[0])
	if assetAsBytes == nil {
		return shim.Error("Asset does not exist")
	}
	asseti := PharmaAsset{}
	json.Unmarshal(assetAsBytes, &asseti)

	if asseti.Owner == args[1] {
		return shim.Error("New owner is the old owner")
	}

	asseti.Owner = args[1]

	assetAsBytes, _ = json.Marshal(asseti)
	error := APIstub.PutState(args[0], assetAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to update asset owner: "))
	}
	return shim.Success(nil)
}

func (s *SmartContract) makeTransaction(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) !=  {
	// 	return shim.Error("Incorrect number of arguments. Expecting ")
	// }
	return shim.Success(nil)
}
