package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

func (s *SmartContract) initializeCounters(APIstub shim.ChaincodeStubInterface) sc.Response {

	var statics = StaticVariables{ManufacturerCount: 0, DistributorCount: 0, ChemistCount: 0}

	staticsAsBytes, _ := json.Marshal(statics)
	error := APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to initialize counters"))
	}

	return shim.Success(nil)
}

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
 * The recordManufacturer method *
Used to view the records of one particular asset
It takes 4 argument --
 -> the key for the Manufacturer to be created
 -> Name for the Manufacturer
 -> Address of the Manufacturer
 -> Timestamp the Manufacturer was recorded
*/

func (s *SmartContract) recordManufacturer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("func: record Manufacturer... Could not get static variables")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	var nextId = "manuf" + strconv.Itoa(statics.ManufacturerCount)

	if checkOwner(APIstub, nextId) == true {
		return shim.Error("Manufacturer already exists")
	}

	var manufacturer = Manufacturer{ID: nextId, Name: args[0], Address: args[1], LicenseNumber: args[2], OwnerName: args[3], OwnerCNIC: args[4], OwnerAddress: args[5], Password: args[6]}

	manufacturerAsBytes, _ := json.Marshal(manufacturer)
	error := APIstub.PutState(nextId, manufacturerAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to record manufacturer: %s", args[0]))
	}

	//update statics
	statics.ManufacturerCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("func: Record Manufacturer... Failed to increment counter"))
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

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("func: record Distributor... Could not get static variables")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	var nextId = "dist" + strconv.Itoa(statics.DistributorCount)

	if checkOwner(APIstub, nextId) == true {
		return shim.Error("Distributor already exists")
	}

	var distributor = Distributor{ID: nextId, Name: args[0], Address: args[1], LicenseNumber: args[2], OwnerName: args[3], OwnerCNIC: args[4], OwnerAddress: args[5], Password: args[6]}

	distributorAsBytes, _ := json.Marshal(distributor)
	error := APIstub.PutState(nextId, distributorAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to record distributor: %s", args[0]))
	}

	//update statics
	statics.DistributorCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("func: Record Distributor... Failed to increment counter"))
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

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("func: record Chemist... Could not get static variables")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	var nextId = "chem" + strconv.Itoa(statics.ChemistCount)

	if checkOwner(APIstub, nextId) == true {
		return shim.Error("Chemist already exists")
	}

	var chemist = Chemist{ID: nextId, Name: args[0], Address: args[1], LicenseNumber: args[2], OwnerName: args[3], OwnerCNIC: args[4], OwnerAddress: args[5], Password: args[6]}

	chemistAsBytes, _ := json.Marshal(chemist)
	error := APIstub.PutState(nextId, chemistAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to record chemist: %s", args[0]))
	}

	//update statics
	statics.ChemistCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("func: Record Chemist... Failed to increment counter"))
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

	if !((strings.HasPrefix(asseti.Owner, "manuf") && strings.HasPrefix(args[1], "dist"))
	|| (strings.HasPrefix(asseti.Owner, "dist") && strings.HasPrefix(args[1], "chem")))
	{
		return shim.Error("Transaction not possible: Please follow basic supply chain flow for pharma industry (Manufacturer->Distributor->Chemist)")
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
