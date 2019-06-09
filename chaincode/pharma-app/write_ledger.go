package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// function to see if an ID exists in an array of IDs or not
// takes 2 arguments
// a []string - the array of IDs in which the search is done
// x string - the ID to find
func Contains(a []string, x string) bool {

	for _, n := range a{
		if strings.Compare(x,n)==0 {
			return true
		}
	}
	return false
}

// function to return the index of an ID if it exists in an array of IDs
// returns -1 if not found
// takes 2 arguments
// a []string - the array of IDs in which the search is done
// x string - the ID to find
func Find(a []string, x string) int {

	for i, n := range a{
		if strings.Compare(x,n)==0 {
			return i
		}
	}
	return -1
}

//----------------------------------------------------------------------------------------------//
// CHAINCODE //
//----------------------------------------------------------------------------------------------//



//--------------------------------------------------------------------------------------//
//ADMIN FUNCTIONS//
//--------------------------------------------------------------------------------------//


// this func is used to activate/suspend a user
// takes 3 arguments
// args[0] - ID of the admin invoking this function
// args[1] - user ID to activate/suspend
// args[2] - a string which is either "suspend" or "activate" to determine the action type
func (s *SmartContract) toggleSuspendUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("In function toggleSuspendUser: Incorrect number of arguments. Expecting 3.")
	}

	if !(strings.HasPrefix(args[0], "admin")) {
		return shim.Error("In function toggleSuspendUser: Admin ID provided is not valid. Admin IDs start with 'admin'.")
	}

	if !(strings.HasPrefix(args[1], "admin") || strings.HasPrefix(args[1], "manuf") || strings.HasPrefix(args[1], "dist") || strings.HasPrefix(args[1], "chem")) {
		return shim.Error("In function toggleSuspendUser: ID provided to suspend/activate is not a valid User ID.")
	}

	if strings.Compare(args[0],args[1])==0 {
		return shim.Error("In function toggleSuspendUser: Can not suspend/activate yourself.")
	}

	if !(strings.Compare(args[2], "suspend")==0 || strings.Compare(args[2], "activate")==0) {
		return shim.Error("In function toggleSuspendUser: Invalid argument[2]. Should be either 'activate' or 'suspend'.")
	}

	if !(strings.HasPrefix(args[1], "admin") || strings.HasPrefix(args[1], "manuf") || strings.HasPrefix(args[1], "dist") || strings.HasPrefix(args[1], "chem")) {
		return shim.Error("In function toggleSuspendUser: ID provided to suspend/activate is not a valid User ID.")
	}

	currentAsBytes, _ := APIstub.GetState(args[0])
	if currentAsBytes == nil {
		return shim.Error("In function toggleSuspendUser: Given Admin does not exist.")
	}

	userAsBytes, _ := APIstub.GetState(args[1])
	if userAsBytes == nil {
		return shim.Error("In function toggleSuspendUser: User to suspend/activate does not exist.")
	}

	current := Admin{}
	json.Unmarshal(currentAsBytes, &current)

	user := User{}
	json.Unmarshal(userAsBytes, &user)

	desc := ""

	if strings.Compare(args[2], "suspend")==0 {

		if user.Suspended==true {
			return shim.Error("In function toggleSuspendUser: User already suspended.")
		} else {
			user.Suspended=true
			desc = "User suspended with ID: "+args[1]+" Name: "+user.Name
		}
	} else {

		if user.Suspended==false {
			return shim.Error("In function toggleSuspendUser: User already active.")
		} else {
			user.Suspended=false
			desc = "User activated with ID: "+args[1]+" Name: "+user.Name
		}
	}

	userAsBytes, _ = json.Marshal(user)
	error := APIstub.PutState(args[1], userAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function toggleSuspendUser: Failed to record User."))
	}


	//update statics and log
	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function toggleSuspendUser: Could not get Statics.")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	nextlogid := "adminlog" + strconv.Itoa(statics.AdminLogCount)

	var adminlog = AdminLog{ID: nextlogid, AdminID: args[0], AdminName: current.Name, Description: desc}

	logAsBytes, _ := json.Marshal(adminlog)
	error = APIstub.PutState(nextlogid, logAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function toggleSuspendUser: Updated User but failed to record Admin Log and update Statics."))
	}

	statics.AdminLogCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function toggleSuspendUser: Updated User and Admin Log but failed to update Statics."))
	}

	return shim.Success(nil)
}


// this func is used by an admin to update his profile
// takes 5 arguments
// args[0] - ID of the admin invoking this function
// args[1] - new name
// args[2] - new password
// args[3] - new CNIC
// args[4] - new email
func (s *SmartContract) updateAdmin(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("In function updateAdmin: Incorrect number of arguments. Expecting 5.")
	}

	if !(strings.HasPrefix(args[0], "admin")) {
		return shim.Error("In function updateAdmin: Admin ID provided is not valid. Admin IDs start with 'admin'.")
	}

	currentAsBytes, _ := APIstub.GetState(args[0])
	if currentAsBytes == nil {
		return shim.Error("In function updateAdmin: Given Admin does not exist.")
	}

	current := Admin{}
	json.Unmarshal(currentAsBytes, &current)


	desc := "Updated profile."
	nameChange := ""
	passwordChange := ""
	cnicChange := ""
	emailChange :=""

	if strings.Compare(current.Name, args[1]) != 0 {
		nameChange = "\nPrevious Name: "+current.Name+" New Name: "+args[1]
	}
	if strings.Compare(current.Password, args[2]) != 0 {
		passwordChange = "\nPassword changed."
	}
	if strings.Compare(current.CNIC, args[3]) != 0 {
		cnicChange = "\nPrevious CNIC: "+current.CNIC+" New CNIC: "+args[3]
	}
	if strings.Compare(current.Email, args[4]) != 0 {
		emailChange = "\nPrevious Email: "+current.Email+" New Email: "+args[4]
	}


	if strings.Compare(nameChange,"")==0 && strings.Compare(passwordChange,"")==0 && strings.Compare(cnicChange,"")==0 && strings.Compare(emailChange,"")==0 {
		return shim.Error("In function updateAdmin: No changes detected.")
	}

	desc += nameChange+cnicChange+emailChange+passwordChange

	current.Name=args[1]
	current.Password=args[2]
	current.CNIC=args[3]
	current.Email=args[4]

	currentAsBytes, _ = json.Marshal(current)
	error := APIstub.PutState(args[0], currentAsBytes)
	if error != nil {
		return shim.Error("In function updateAdmin: Failed to record Admin.")
	}


	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function updateAdmin: Could not get Statics.")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	nextlogid := "adminlog" + strconv.Itoa(statics.AdminLogCount)

	var adminlog = AdminLog{ID: nextlogid, AdminID: args[0], AdminName: current.Name, Description: desc}

	logAsBytes, _ := json.Marshal(adminlog)
	error = APIstub.PutState(nextlogid, logAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function updateAdmin: Updated Admin but failed to record Admin Log and update Statics."))
	}

	statics.AdminLogCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function updateAdmin: Updated Admin and Admin Log but failed to update Statics."))
	}

	return shim.Success(nil)
}

// this func is used by an admin to create a new admin
// takes 5 arguments
// args[0] - ID of the admin invoking this function
// args[1] - name of new admin
// args[2] - password of new admin
// args[3] - CNIC of new admin
// args[4] - email of new admin
func (s *SmartContract) createAdmin(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("In function updateAdmin: Incorrect number of arguments. Expecting 5.")
	}

	if !(strings.HasPrefix(args[0], "admin")) {
		return shim.Error("In function createAdmin: Current Admin ID provided is not valid. Admin IDs start with 'admin'.")
	}

	currentAsBytes, _ := APIstub.GetState(args[0])
	if currentAsBytes == nil {
		return shim.Error("In function createAdmin: Current Admin does not exist.")
	}

	current := Admin{}
	json.Unmarshal(currentAsBytes, &current)


	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function createAdmin: Could not get Statics.")
	}
	json.Unmarshal(staticsAsBytes, &statics)

	var nextId = "admin" + strconv.Itoa(statics.AdminCount)

	if checkOwner(APIstub, nextId) == true {
		return shim.Error("In function createAdmin: Admin with the assigned ID: " + nextId + " already exists.")
	}

	var admin = Admin{ID: nextId, Name: args[1], Password: args[2], CNIC: args[3], Email: args[4]}

	adminAsBytes, _ := json.Marshal(admin)
	error := APIstub.PutState(nextId, adminAsBytes)
	if error != nil {
		return shim.Error("In function createAdmin: Failed to record Admin against ID: " + nextId)
	}

	//update statics and log
	statics.AdminCount += 1

	nextlogid := "adminlog" + strconv.Itoa(statics.AdminLogCount)
	desc := "New Admin created. ID: " + nextId + " Name: " + args[1]

	var adminlog = AdminLog{ID: nextlogid, AdminID: args[0], AdminName: current.Name, Description: desc}

	logAsBytes, _ := json.Marshal(adminlog)
	error = APIstub.PutState(nextlogid, logAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function createAdmin: Recorded new Admin but failed to record Admin Log and update Statics."))
	}

	statics.AdminLogCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function createAdmin: Recorded new Admin and Admin Log but failed to update Statics."))
	}

	return shim.Success(nil)
}

// this func is used by an admin to create a new manufacturer
// takes 9 arguments
// args[0] - ID of the admin invoking this function
// args[1] - name of new manuf
// args[2] - address of new manuf
// args[3] - license numer of new manuf
// args[4] - owner Name of new manuf
// args[5] - owner CNIC  of new manuf
// args[6] - owner Address of new manuf
// args[7] - password of new manuf (auto generated from frontend and emailed privately to new user)
// args[8] - email of new manuf
func (s *SmartContract) recordManufacturer(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 9 {
		return shim.Error("In function recordManufacturer: Incorrect number of arguments. Expecting 9.")
	}

	if !(strings.HasPrefix(args[0], "admin")) {
		return shim.Error("In function recordManufacturer: Admin ID provided is not valid. Admin IDs start with 'admin'.")
	}

	currentAsBytes, _ := APIstub.GetState(args[0])
	if currentAsBytes == nil {
		return shim.Error("In function recordManufacturer: Given Admin does not exist.")
	}

	current := Admin{}
	json.Unmarshal(currentAsBytes, &current)


	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function recordManufacturer: Could not get Statics.")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	var nextId = "manuf" + strconv.Itoa(statics.ManufacturerCount)

	if checkOwner(APIstub, nextId) == true {
		return shim.Error("In function recordManufacturer: Manufacturer with the assigned ID: " + nextId + " already exists.")
	}

	var manufacturer = Manufacturer{ID: nextId, Name: args[1], Address: args[2], LicenseNumber: args[3], OwnerName: args[4], OwnerCNIC: args[5], OwnerAddress: args[6], Password: args[7], Email: args[8]}

	manufacturerAsBytes, _ := json.Marshal(manufacturer)
	error := APIstub.PutState(nextId, manufacturerAsBytes)
	if error != nil {
		return shim.Error("In function recordManufacturer: Failed to record Manufacturer against ID: " + nextId)
	}

	//update statics and log
	statics.ManufacturerCount += 1

	nextlogid := "adminlog" + strconv.Itoa(statics.AdminLogCount)
	desc := "New Manufacturer created. ID: " + nextId + " Name: " + args[1]

	var adminlog = AdminLog{ID: nextlogid, AdminID: args[0], AdminName: current.Name, Description: desc}

	logAsBytes, _ := json.Marshal(adminlog)
	error = APIstub.PutState(nextlogid, logAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function recordManufacturer: Recorded Manufacturer but failed to record Admin Log and update Statics."))
	}

	statics.AdminLogCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function recordManufacturer: Recorded Manufacturer and Admin Log but failed to update Statics."))
	}

	return shim.Success(nil)
}

// this func is used by an admin to create a new Distributor
// takes 9 arguments
// args[0] - ID of the admin invoking this function
// args[1] - name of new dist
// args[2] - address of new dist
// args[3] - license numer of new dist
// args[4] - owner Name of new dist
// args[5] - owner CNIC  of new dist
// args[6] - owner Address of new dist
// args[7] - password of new dist (auto generated from frontend and emailed privately to new user)
// args[8] - email of new dist
func (s *SmartContract) recordDistributor(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 9 {
		return shim.Error("In function recordDistributor: Incorrect number of arguments. Expecting 9.")
	}

	if !(strings.HasPrefix(args[0], "admin")) {
		return shim.Error("In function recordDistributor: Admin ID provided is not valid. Admin IDs start with 'admin'.")
	}

	currentAsBytes, _ := APIstub.GetState(args[0])
	if currentAsBytes == nil {
		return shim.Error("In function recordDistributor: Given Admin does not exist.")
	}

	current := Admin{}
	json.Unmarshal(currentAsBytes, &current)


	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function recordDistributor: Could not get Statics.")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	var nextId = "dist" + strconv.Itoa(statics.DistributorCount)

	if checkOwner(APIstub, nextId) == true {
		return shim.Error("In function recordDistributor: Distributor with the assigned ID: " + nextId + " already exists.")
	}

	var distributor = Distributor{ID: nextId, Name: args[1], Address: args[2], LicenseNumber: args[3], OwnerName: args[4], OwnerCNIC: args[5], OwnerAddress: args[6], Password: args[7], Email: args[8]}

	distributorAsBytes, _ := json.Marshal(distributor)
	error := APIstub.PutState(nextId, distributorAsBytes)
	if error != nil {
		return shim.Error("In function recordDistributor: Failed to record Distributor against ID: " + nextId)
	}


	//update statics and log
	statics.DistributorCount += 1

	nextlogid := "adminlog" + strconv.Itoa(statics.AdminLogCount)
	desc := "New Distributor created. ID: " + nextId + " Name: " + args[1]

	var adminlog = AdminLog{ID: nextlogid, AdminID: args[0], AdminName: current.Name, Description: desc}

	logAsBytes, _ := json.Marshal(adminlog)
	error = APIstub.PutState(nextlogid, logAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function recordDistributor: Recorded Distributor but failed to record Admin Log and update Statics."))
	}

	statics.AdminLogCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function recordDistributor: Recorded Distributor and Admin Log but failed to update Statics."))
	}

	return shim.Success(nil)
}

// this func is used by an admin to create a new Chemist
// takes 9 arguments
// args[0] - ID of the admin invoking this function
// args[1] - name of new chem
// args[2] - address of new chem
// args[3] - license numer of new chem
// args[4] - owner Name of new chem
// args[5] - owner CNIC  of new chem
// args[6] - owner Address of new chem
// args[7] - password of new chem (auto generated from frontend and emailed privately to new user)
// args[8] - email of new chem
func (s *SmartContract) recordChemist(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 9 {
		return shim.Error("In function recordChemist: Incorrect number of arguments. Expecting 9.")
	}

	if !(strings.HasPrefix(args[0], "admin")) {
		return shim.Error("In function recordChemist: Admin ID provided is not valid. Admin IDs start with 'admin'.")
	}

	currentAsBytes, _ := APIstub.GetState(args[0])
	if currentAsBytes == nil {
		return shim.Error("In function recordChemist: Given Admin does not exist.")
	}

	current := Admin{}
	json.Unmarshal(currentAsBytes, &current)

	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function recordChemist: Could not get Statics.")
	}
	json.Unmarshal(staticsAsBytes, &statics) //un stringify it aka JSON.parse()

	var nextId = "chem" + strconv.Itoa(statics.ChemistCount)

	if checkOwner(APIstub, nextId) == true {
		return shim.Error("In function recordChemist: Chemist with the assigned ID: " + nextId + " already exists.")
	}

	var chemist = Chemist{ID: nextId, Name: args[1], Address: args[2], LicenseNumber: args[3], OwnerName: args[4], OwnerCNIC: args[5], OwnerAddress: args[6], Password: args[7], Email: args[8]}

	chemistAsBytes, _ := json.Marshal(chemist)
	error := APIstub.PutState(nextId, chemistAsBytes)
	if error != nil {
		return shim.Error("In function recordChemist: Failed to record Distributor against ID: " + nextId)
	}


	//update statics and log
	statics.ChemistCount += 1

	nextlogid := "adminlog" + strconv.Itoa(statics.AdminLogCount)
	desc := "New Chemist created. ID: " + nextId + " Name: " + args[1]

	var adminlog = AdminLog{ID: nextlogid, AdminID: args[0], AdminName: current.Name, Description: desc}

	logAsBytes, _ := json.Marshal(adminlog)
	error = APIstub.PutState(nextlogid, logAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function recordChemist: Recorded Chemist but failed to record Admin Log and update Statics."))
	}

	statics.AdminLogCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function recordChemist: Recorded Chemist and Admin Log but failed to update Statics."))
	}

	return shim.Success(nil)
}

//-------------------------------------------------------------//
//END OF ADMIN FUNCTIONS//
//-------------------------------------------------------------//

// this func is used by a manufacturer to enroll a distributor
// takes 2 arguments
// args[0] - ID of the manufacturer invoking this function
// args[1] - ID of the distributor the be enrolled
func (s *SmartContract) enrollDistributor(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("In function enrollDistributor: Incorrect number of arguments. Expecting 2.")
	}

	if !strings.HasPrefix(args[0], "manuf") {
		return shim.Error("In function enrollDistributor: Manufacturer ID provided is not valid. Manufacturer IDs start with 'manuf'.")
	}
	if !strings.HasPrefix(args[1], "dist") {
		return shim.Error("In function enrollDistributor: Distributor ID provided is not valid. Distributor IDs start with 'dist'.")
	}

	manufAsBytes, _ := APIstub.GetState(args[0])
	if manufAsBytes == nil {
		return shim.Error("In function enrollDistributor: Given Manufacturer not found.")
	}

	distAsBytes, _ := APIstub.GetState(args[1])
	if distAsBytes == nil {
		return shim.Error("In function enrollDistributor: Given Distributor not found.")
	}

	current := Manufacturer{}
	json.Unmarshal(manufAsBytes, &current)

	for i := 0; i < len(current.Distributors); i++ {
		if current.Distributors[i] == args[1] {
    		return shim.Error("In function enrollDistributor: Distributor already exists")
		}
   	}

	current.Distributors = append(current.Distributors, args[1])

	manufAsBytes, _ = json.Marshal(current)
	error := APIstub.PutState(args[0], manufAsBytes)
	if error != nil {
		return shim.Error("In function enrollDistributor: Failed to record Manufacturer.")
	}

	return shim.Success(nil)
}

// this func is used by a distributor to enroll a chemist
// takes 2 arguments
// args[0] - ID of the distrbutor invoking this function
// args[1] - ID of the chemist the be enrolled
func (s *SmartContract) enrollChemist(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("In function enrollChemist: Incorrect number of arguments. Expecting 2.")
	}

	if !strings.HasPrefix(args[0], "dist") {
		return shim.Error("In function enrollChemist: Distributor ID provided is not valid. Distributor IDs start with 'dist'.")
	}
	if !strings.HasPrefix(args[1], "chem") {
		return shim.Error("In function enrollChemist: Chemist ID provided is not valid. Chemist IDs start with 'chem'.")
	}

	distAsBytes, _ := APIstub.GetState(args[0])
	if distAsBytes == nil {
		return shim.Error("In function enrollChemist: Given Distributor not found.")
	}

	chemAsBytes, _ := APIstub.GetState(args[1])
	if chemAsBytes == nil {
		return shim.Error("In function enrollChemist: Given Chemist not found.")
	}

	current := Distributor{}
	json.Unmarshal(distAsBytes, &current)

	for i := 0; i < len(current.Chemists); i++ {
		if current.Chemists[i] == args[1] {
    		return shim.Error("In function enrollChemist: Chemist already exists")
		}
   	}

	current.Chemists = append(current.Chemists, args[1])

	distAsBytes, _ = json.Marshal(current)
	error := APIstub.PutState(args[0], distAsBytes)
	if error != nil {
		return shim.Error("In function enrollChemist: Failed to record Distributor.")
	}

	return shim.Success(nil)
}

// this function initializes the static counters to zeroes
// takes no args
func (s *SmartContract) initializeCounters(APIstub shim.ChaincodeStubInterface) sc.Response {

	var statics = StaticVariables{ManufacturerCount: 0, DistributorCount: 0, ChemistCount: 0, AdminCount: 0, AdminLogCount: 0}

	staticsAsBytes, _ := json.Marshal(statics)
	error := APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function initializeCounters: Failed to record Statics."))
	}

	return shim.Success(nil)
}


// this func is used by a manufacturer to create a product
// takes 8 arguments
// args[0] - ID of the manufacturer invoking this function
// args[1] - name of new product
// args[2] - type of product
// args[3] - description
// args[4] - retail price
// args[5] - unit quantity
// args[6] - carton capacity (packets/carton)
// args[7] - packet capacity (assets/packet)
func (s *SmartContract) createProduct(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 8 {

		return shim.Error("In function createProduct: Incorrect number of arguments. Expecting 8.")
	}

	if !strings.HasPrefix(args[0], "manuf") {
		return shim.Error("In function createProduct: Manufacturer ID provided is not valid. Manufacturer IDs start with 'manuf'.")
	}

	manufAsBytes, _ := APIstub.GetState(args[0])
	if manufAsBytes == nil {
		return shim.Error("In function createProduct: Given Manufacturer not found.")
	}

	var statics StaticVariables
	staticsAsBytes, _ := APIstub.GetState("StaticVariables")
	if staticsAsBytes == nil {
		return shim.Error("In function createProduct: Could not get Statics.")
	}
	json.Unmarshal(staticsAsBytes, &statics)

	var nextId = "prod" + strconv.Itoa(statics.ProductCount)

	if checkOwner(APIstub, nextId) == true {
		return shim.Error("In function createProduct: Product with the assigned ID: " + nextId + " already exists.")
	}

	var rprice, err1 = strconv.ParseFloat(args[4], 32)
	if err1 != nil {
		fmt.Println(err1)
	}
	var rprice2=float32(rprice)


	var uquantity, err2 = strconv.Atoi(args[5])
	if err1 != nil {
		fmt.Println(err2)
	}
	var cc, err3 = strconv.Atoi(args[6])
	if err1 != nil {
		fmt.Println(err3)
	}
	var pc, err4 = strconv.Atoi(args[7])
	if err1 != nil {
		fmt.Println(err4)
	}

	var product = Product{ID: nextId, Name: args[1], AssetType: args[2], Description: args[3], RetailPrice: rprice2, UnitQuantity: uquantity, CartonCapacity: cc, PacketCapacity: pc, ManufacturerID: args[0]}

	productAsBytes, _ := json.Marshal(product)
	error := APIstub.PutState(nextId, productAsBytes)
	if error != nil {
		return shim.Error("In function createProduct: Failed to record Product against ID: " + nextId)
	}

	//update statics and log
	statics.ProductCount += 1

	staticsAsBytes, _ = json.Marshal(statics)
	error = APIstub.PutState("StaticVariables", staticsAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function createProduct: Recorded new Product but failed to update Statics."))
	}

	current := Manufacturer{}
	json.Unmarshal(manufAsBytes, &current)

	current.Products = append(current.Products, nextId)

	manufAsBytes, _ = json.Marshal(current)
	error = APIstub.PutState(args[0], manufAsBytes)
	if error != nil {
		return shim.Error("In function createProduct: Product created and updated Statics but failed to record Manufacturer.")
	}

	return shim.Success(nil)
}


// this func is used by a manufacturer to update its product
// takes 8 arguments
// args[0] - ID of the product to be updated
// args[1] - name of new product
// args[2] - type of product
// args[3] - description
// args[4] - retail price
// args[5] - unit quantity
// args[6] - carton capacity (packets/carton)
// args[7] - packet capacity (assets/packet)
func (s *SmartContract) updateProduct(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 8 {

		return shim.Error("In function updateProduct: Incorrect number of arguments. Expecting 8.")
	}

	if !strings.HasPrefix(args[0], "prod") {
		return shim.Error("In function updateProduct: Product ID provided is not valid. Product IDs start with 'prod'.")
	}

	prodAsBytes, _ := APIstub.GetState(args[0])
	if prodAsBytes == nil {
		return shim.Error("In function updateProduct: Given Product not found.")
	}

	product := Product{}
	json.Unmarshal(prodAsBytes, &product)

	product.Name=args[1]
	product.AssetType=args[2]
	product.Description=args[3]

	var rprice, err1 = strconv.ParseFloat(args[4],32)
	if err1 != nil {
		fmt.Println(err1)
	}
	var rprice2=float32(rprice)
	product.RetailPrice=rprice2

	var uquantity, err2 = strconv.Atoi(args[5])
	if err1 != nil {
		fmt.Println(err2)
	}
	product.UnitQuantity=uquantity

	var cc, err3 = strconv.Atoi(args[6])
	if err1 != nil {
		fmt.Println(err3)
	}
	product.CartonCapacity=cc

	var pc, err4 = strconv.Atoi(args[7])
	if err1 != nil {
		fmt.Println(err4)
	}
	product.PacketCapacity=pc

	productAsBytes, _ := json.Marshal(product)
	error := APIstub.PutState(args[0], productAsBytes)
	if error != nil {
		return shim.Error("In function updateProduct: Failed to record Product.")
	}

	return shim.Success(nil)
}




// this func is used by a manufacturer to create a batch
// creates a Batch object, and creates all the nested Cartons, Packets and Assets iteratively
// takes 8 arguments
// args[0] - ID of the manufacturer invoking this function
// args[1] - product ID for which the batch is created
// args[2] - manuf Date
// args[3] - expiry Date
// args[4] - no. of cartons in batch
func (s *SmartContract) createBatch(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("In function createBatch: Incorrect number of arguments. Expecting 5.")
	}

	argsOwnerID := args[0]
	argsProductID := args[1]
	//manufactureDate args[2]
	//expiryDate args[3]
	//cartonQuantity args[4]


	if !(strings.HasPrefix(argsOwnerID, "manuf")) {
		return shim.Error("In function createBatch: Owner ID provided is not a valid Manufacturer ID. Manufacturer IDs start with 'manuf'.")
	}
	if !(strings.HasPrefix(argsProductID, "prod")) {
		return shim.Error("In function createBatch: Product ID provided is not a valid Product ID. Product IDs start with 'prod'.")
	}

	newOwnerAsBytes, _ := APIstub.GetState(argsOwnerID)
	if newOwnerAsBytes == nil {
		return shim.Error("In function createBatch: Given Manufacturer does not exist.")
	}

	productAsBytes, _ := APIstub.GetState(argsProductID)
	if newOwnerAsBytes == nil {
		return shim.Error("In function createBatch: Given Product does not exist.")
	}

	newOwner := Manufacturer{}
	json.Unmarshal(newOwnerAsBytes, &newOwner)

	if !(Contains(newOwner.Products,argsProductID)) {
		return shim.Error("In function createBatch: Product ID provided does not belong to the given Manufacturer.")
	}

	product := Product{}
	json.Unmarshal(productAsBytes, &product)


	//QRCODE SCHEME
	/*
	5 characters manuf
	5 characters batch id
	5 characters carton id
	5 characters pack id
	5 characters grain asset id

	25 chacracter string TOTAL
	*/

	manufstring := argsOwnerID[5:]

	batchid := strconv.Itoa(newOwner.BatchCount)
	newOwner.BatchCount += 1


	for len(manufstring)<5 {
		manufstring = "0"+manufstring
	}

	for len(batchid)<5 {
		batchid = "0"+batchid
	}

	newbatchid := manufstring+batchid+"000000000000000"

	assetAsBytes, _ := APIstub.GetState(newbatchid)
	if assetAsBytes != nil {
		return shim.Error("In function createBatch: Batch with the assigned ID already exists.")
	}

	var cartonQuantity, err1 = strconv.Atoi(args[4])
	if err1 != nil {
		fmt.Println(err1)
	}

	//create Batch
	var batch = Batch{ID: newbatchid, ProductID: argsProductID, ProductName: product.Name, ManufactureDate: args[2], ExpiryDate: args[3], CartonQuantity: cartonQuantity, Owner: argsOwnerID, OwnerName:newOwner.Name}


	assetAsBytes, _ = json.Marshal(batch)
	error := APIstub.PutState(newbatchid, assetAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function createBatch: Failed to record Batch against assigned ID: %s", newbatchid))
	}

	cartonID := 1
	for cartonID<=cartonQuantity {

		newcartonid := strconv.Itoa(cartonID)
		for len(newcartonid)<5 {
			newcartonid = "0"+newcartonid
		}
		newcartonid1 := manufstring+batchid+newcartonid+"0000000000"

		cartonID += 1

		//create Carton
		var carton = Carton{ID: newcartonid1, ProductID: argsProductID, ProductName: product.Name, ManufactureDate: args[2], ExpiryDate: args[3], Owner: argsOwnerID, OwnerName:newOwner.Name}

		assetAsBytes, _ = json.Marshal(carton)
		error := APIstub.PutState(newcartonid1, assetAsBytes)
		if error != nil {
			return shim.Error(fmt.Sprintf("In function createBatch: Failed to record a Carton against assigned ID: %s", newcartonid))
		}


		packID := 1
		for packID<=product.CartonCapacity {

			newpackid := strconv.Itoa(packID)
			for len(newpackid)<5 {
				newpackid = "0"+newpackid
			}
			newpackid1 := manufstring+batchid+newcartonid+newpackid+"00000"

			packID += 1

			//create Packet
			var packet = Packet{ID: newpackid1, ProductID: argsProductID, ProductName: product.Name, ManufactureDate: args[2], ExpiryDate: args[3], Owner: argsOwnerID, OwnerName:newOwner.Name}

			assetAsBytes, _ = json.Marshal(packet)
			error := APIstub.PutState(newpackid1, assetAsBytes)
			if error != nil {
				return shim.Error(fmt.Sprintf("In function createBatch: Failed to record a Packet against assigned ID: %s", newpackid))
			}

			assetID := 1
			for assetID<=product.PacketCapacity {

				newassetid := strconv.Itoa(assetID)
				for len(newassetid)<5 {
					newassetid = "0"+newassetid
				}
				newassetid1 := manufstring+batchid+newcartonid+newpackid+newassetid

				assetID += 1

				//create Asset
				var passet = PharmaAsset{ID: newassetid1, ProductID: argsProductID, ProductName: product.Name, ManufactureDate: args[2], ExpiryDate: args[3], Owner: argsOwnerID, OwnerName:newOwner.Name}

				assetAsBytes, _ = json.Marshal(passet)
				error := APIstub.PutState(newassetid1, assetAsBytes)
				if error != nil {
					return shim.Error(fmt.Sprintf("In function createBatch: Failed to record a PharmaAsset against assigned ID: %s", newassetid))
				}
				newOwner.Assets = append(newOwner.Assets, newassetid1)

			}

		}

	}


	newOwnerAsBytes, _ = json.Marshal(newOwner)
	error = APIstub.PutState(argsOwnerID, newOwnerAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("In function createBatch: Recorded Batch but failed to insert in assets of Manufacturer."))
	}

	return shim.Success(nil)
}



// this func is used by a User(manuf/chem/dist) to update its profile
// takes 9 arguments
// args[0] - ID of the user invoking this function
// args[1] - name
// args[2] - address
// args[3] - password
// args[4] - owner Name
// args[5] - owner CNIC
// args[6] - owner Address
// args[7] - email
func (s *SmartContract) updateUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 8")
	}


	if !(strings.HasPrefix(args[0], "manuf") || strings.HasPrefix(args[0], "dist") || strings.HasPrefix(args[0], "chem")) {
		return shim.Error("ID provided does not belong to a valid user")
	}


	userAsBytes, _ := APIstub.GetState(args[0])
	if userAsBytes == nil {
		return shim.Error("User does not exist")
	}


	user := User{}
	json.Unmarshal(userAsBytes, &user)

	user.Name = args[1]
	user.Address = args[2]
	user.Password = args[3]
	user.OwnerName = args[4]
	user.OwnerCNIC = args[5]
	user.OwnerAddress = args[6]
	user.Email = args[7]



	userAsBytes, _ = json.Marshal(user)
	error := APIstub.PutState(args[0], userAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to write updated user to ledger"))
	}


	return shim.Success(nil)
}



// this function transacts assets from one user to other
// determines whether transaction is bulk or single
// if transaction is bulk, transfers all the nested Cartons, Packets and Assets iteratively
// takes 3 arguments
// args[0] - ID of the user invoking this function
// args[1] - assetID
// args[2] - recipient userID
func (s *SmartContract) changeAssetOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {



	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	assetAsBytes, _ := APIstub.GetState(args[1])
	if assetAsBytes == nil {
		return shim.Error("Asset does not exist")
	}
	assetid := args[1]

	cartonid := assetid[10:15]
	packid	:= assetid[15:20]
	asstid := assetid[20:25]

	cartonbool := strings.Compare(cartonid,"00000")==0
	packbool := strings.Compare(packid,"00000")==0
	assetbool := strings.Compare(asstid,"00000")==0


	var ids []string


	if cartonbool==true && packbool==true && assetbool==true {

		asset := Batch{}
		json.Unmarshal(assetAsBytes, &asset)

		prodAsBytes, _ := APIstub.GetState(asset.ProductID)
		if prodAsBytes == nil {
			return shim.Error("Product does not exist")
		}
		product := Product{}
		json.Unmarshal(prodAsBytes, &product)

		cartonCount := asset.CartonQuantity
		packetCount := product.CartonCapacity
		assetCount := product.PacketCapacity

		newid := assetid[0:10]

		cc := 1
		pc := 1
		ac := 1
		for cc<=cartonCount {
			pc=1
			for pc<=packetCount{
				ac=1
				for ac<=assetCount{

					cc1:= strconv.Itoa(cc)
					pc1:= strconv.Itoa(pc)
					ac1:= strconv.Itoa(ac)

					for len(cc1)<5 {
						cc1 = "0"+cc1
					}
					for len(pc1)<5 {
						pc1 = "0"+pc1
					}
					for len(ac1)<5 {
						ac1 = "0"+ac1
					}
					app:=newid+cc1+pc1+ac1
					ids=append(ids,app)

					ac+=1
				}
				pc+=1
			}
			cc+=1
		}


	} else if cartonbool==false && packbool==true && assetbool==true {

		asset := Carton{}
		json.Unmarshal(assetAsBytes, &asset)

		prodAsBytes, _ := APIstub.GetState(asset.ProductID)
		if prodAsBytes == nil {
			return shim.Error("Product does not exist")
		}
		product := Product{}
		json.Unmarshal(prodAsBytes, &product)

		packetCount := product.CartonCapacity
		assetCount := product.PacketCapacity

		newid := assetid[0:15]

		pc := 1
		ac := 1

		for pc<=packetCount{
			ac=1
			for ac<=assetCount{

				pc1:= strconv.Itoa(pc)
				ac1:= strconv.Itoa(ac)

				for len(pc1)<5 {
					pc1 = "0"+pc1
				}
				for len(ac1)<5 {
					ac1 = "0"+ac1
				}
				app:=newid+pc1+ac1
				ids=append(ids,app)

				ac+=1
			}
			pc+=1
		}


	} else if cartonbool==false && packbool==false && assetbool==true {

		asset := Packet{}
		json.Unmarshal(assetAsBytes, &asset)

		prodAsBytes, _ := APIstub.GetState(asset.ProductID)
		if prodAsBytes == nil {
			return shim.Error("Product does not exist")
		}
		product := Product{}
		json.Unmarshal(prodAsBytes, &product)

		assetCount := product.PacketCapacity

		newid := assetid[0:20]

		ac := 1

		for ac<=assetCount{

			ac1:= strconv.Itoa(ac)

			for len(ac1)<5 {
				ac1 = "0"+ac1
			}
			app:=newid+ac1
			ids=append(ids,app)

			ac+=1
		}


	} else if cartonbool==false && packbool==false && assetbool==false {

		ids=append(ids,args[1])

	}


	asset := PharmaAsset{}
	json.Unmarshal(assetAsBytes, &asset)

	oldid:= args[0]
	currentOwnerAsBytes, _ := APIstub.GetState(oldid)
	if currentOwnerAsBytes == nil {
		return shim.Error("Current owner does not exist")
	}
	currentOwner := User{}
	json.Unmarshal(currentOwnerAsBytes, &currentOwner)

	for _, aid := range ids {

		if Find(currentOwner.Assets,aid)==-1 {
			return shim.Error("Current owner does not own complete asset."+aid)
		}
	}


	newOwnerAsBytes, _ := APIstub.GetState(args[2])
	if newOwnerAsBytes == nil {
		return shim.Error("New owner does not exist")
	}

	newOwner := User{}
	json.Unmarshal(newOwnerAsBytes, &newOwner)

	for _, asid := range ids {

		asidAsBytes, _ := APIstub.GetState(asid)
		if asidAsBytes == nil {
			return shim.Error("An asset does not exist")
		}

		asset := PharmaAsset{}
		json.Unmarshal(asidAsBytes, &asset)

		if asset.Owner == args[2] {
			return shim.Error("New owner is the old owner")
		}

		if !((strings.HasPrefix(asset.Owner, "manuf") && strings.HasPrefix(args[2], "dist")) || (strings.HasPrefix(asset.Owner, "dist") && strings.HasPrefix(args[2], "chem"))) {
			return shim.Error("Transaction not possible: Please follow basic supply chain flow for pharma industry (Manufacturer->Distributor->Chemist)")
		}


		//i := Find(currentOwner.Assets,asid)
		//if i>=0 {
		//	currentOwner.Assets[i]=currentOwner.Assets[len(currentOwner.Assets)-1]
		//	currentOwner.Assets=currentOwner.Assets[:len(currentOwner.Assets)-1]
		//}

		var indexes []int
		for index, ast := range currentOwner.Assets {
			if strings.Compare(ast,asid)==0 {
					indexes=append(indexes,index)
			}
		}
		for _, ind := range indexes {
			currentOwner.Assets = append(currentOwner.Assets[:ind], currentOwner.Assets[ind+1:]...)
		}

		asset.Owner = args[2]
		asset.OwnerName=newOwner.Name

		newOwner.Assets = append(newOwner.Assets, asid)

		asidAsBytes, _ = json.Marshal(asset)
		error := APIstub.PutState(asid, asidAsBytes)
		if error != nil {
			return shim.Error(fmt.Sprintf("Failed to update asset owner in asset"))
		}

	}

	currentOwnerAsBytes, _ = json.Marshal(currentOwner)
	error := APIstub.PutState(oldid, currentOwnerAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed update old owner"))
	}

	newOwnerAsBytes, _ = json.Marshal(newOwner)
	error = APIstub.PutState(args[2], newOwnerAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to add asset in user"))
	}


	return shim.Success(nil)
}


// this func is used by a Chemist to sell an asset to a customer
// takes 5 arguments
// args[0] - ID of the chemist invoking this function
// args[1] - assetID
// args[2] - customer name
// args[3] - customer phone
// args[4] - timestamp (auto generated from frontend)
func (s *SmartContract) sellAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	assetAsBytes, _ := APIstub.GetState(args[1])
	if assetAsBytes == nil {
		return shim.Error("Asset does not exist")
	}

	assetid := args[1]

	cartonid := assetid[10:15]
	packid	:= assetid[15:20]
	asstid := assetid[20:25]

	cartonbool := strings.Compare(cartonid,"00000")==0
	packbool := strings.Compare(packid,"00000")==0
	assetbool := strings.Compare(asstid,"00000")==0


	var ids []string


	if cartonbool==false && packbool==false && assetbool==true {

		asset := Packet{}
		json.Unmarshal(assetAsBytes, &asset)

		prodAsBytes, _ := APIstub.GetState(asset.ProductID)
		if prodAsBytes == nil {
			return shim.Error("Product does not exist")
		}
		product := Product{}
		json.Unmarshal(prodAsBytes, &product)

		assetCount := product.PacketCapacity

		newid := assetid[0:20]

		ac := 1

		for ac<=assetCount{

			ac1:= strconv.Itoa(ac)

			for len(ac1)<5 {
				ac1 = "0"+ac1
			}
			app:=newid+ac1
			ids=append(ids,app)

			ac+=1
		}


	} else if cartonbool==false && packbool==false && assetbool==false {

		ids=append(ids,args[1])

	} else {
		return shim.Error("Only Packet or PharmaAsset can be sold to a Customer.")
	}

	asset := PharmaAsset{}
	json.Unmarshal(assetAsBytes, &asset)

	oldid:=args[0]
	currentOwnerAsBytes, _ := APIstub.GetState(oldid)
	if currentOwnerAsBytes == nil {
		return shim.Error("Current owner does not exist")
	}
	currentOwner := User{}
	json.Unmarshal(currentOwnerAsBytes, &currentOwner)

	for _, aid := range ids {

		if Find(currentOwner.Assets,aid)==-1 {
			return shim.Error("Current owner does not own complete asset.")
		}
	}

	for _, asid := range ids {

		asidAsBytes, _ := APIstub.GetState(asid)
		if asidAsBytes == nil {
			return shim.Error("An asset does not exist")
		}
		asseti := PharmaAsset{}
		json.Unmarshal(asidAsBytes, &asseti)

		if asseti.Customer != (CustomerRelation{}) {
			return shim.Error("Asset already sold.")
		}

	}

	for _, asid := range ids {

		asidAsBytes, _ := APIstub.GetState(asid)
		if asidAsBytes == nil {
			return shim.Error("An asset does not exist")
		}

		asseti := PharmaAsset{}
		json.Unmarshal(asidAsBytes, &asseti)


		asseti.Customer = CustomerRelation{Name: args[2], PhoneNumber: args[3], Timestamp: args[4]}


		var indexes []int
		for index, ast := range currentOwner.Assets {
			if strings.Compare(ast,asid)==0 {
					indexes=append(indexes,index)
			}
		}
		for _, ind := range indexes {
			currentOwner.Assets = append(currentOwner.Assets[:ind], currentOwner.Assets[ind+1:]...)
		}


		asidAsBytes, _ = json.Marshal(asseti)
		error := APIstub.PutState(asid, asidAsBytes)
		if error != nil {
			return shim.Error(fmt.Sprintf("Failed to write asset"))
		}

	}

	currentOwnerAsBytes, _ = json.Marshal(currentOwner)
	error := APIstub.PutState(oldid, currentOwnerAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed update old owner"))
	}


	return shim.Success(nil)
}


// this func is used by a user to return an asset to its previous owner
// calls getHistory for the asset and determines the supplier automatically
// takes 2 arguments
// args[0] - ID of the user invoking this function
// args[1] - asetid
func (s *SmartContract) returnAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	toFind := ""
	if strings.HasPrefix(args[0], "manuf") {
		return shim.Error("A Manufacturer can not return an asset.")
	} else if strings.HasPrefix(args[0], "dist") {
		toFind="manuf"
	} else if strings.HasPrefix(args[0], "chem") {
		toFind="dist"
	} else if strings.HasPrefix(args[0], "cust") {
		toFind="chem"
	}
	

	assetAsBytes, _ := APIstub.GetState(args[1])
	if assetAsBytes == nil {
		return shim.Error("Asset does not exist")
	}

	asseti := PharmaAsset{}
	json.Unmarshal(assetAsBytes, &asseti)

	if strings.Compare(toFind,"chem")==0 {
		if !(strings.HasPrefix(asseti.Owner,"chem") && asseti.Customer != CustomerRelation{}) {
			return shim.Error("Asset was not sold.")
		}

	}


	var asset PharmaAsset

	newOwner:=""

	iterator, err := APIstub.GetHistoryForKey(args[1])
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
			if strings.HasPrefix(asset.Owner,toFind)==true {
				newOwner=asset.Owner
			}
		}
	}
	userAsBytes, _ := APIstub.GetState(newOwner)
	if userAsBytes == nil {
		return shim.Error("User does not exist")
	}

	oldid:=asseti.Owner
	oldAsBytes, _ := APIstub.GetState(oldid)
	if oldAsBytes == nil {
		return shim.Error("User does not exist")
	}

	old := User{}
	json.Unmarshal(oldAsBytes, &old)

	//i := Find(old.Assets,args[0])
	//if i>=0 {
	//	old.Assets[i]=old.Assets[len(old.Assets)-1]
	//	old.Assets=old.Assets[:len(old.Assets)-1]
	//}
	var indexes []int
	for index, ast := range old.Assets {
		if strings.Compare(ast,args[1])==0 {
				indexes=append(indexes,index)
		}
	}
	for _, ind := range indexes {
		old.Assets = append(old.Assets[:ind], old.Assets[ind+1:]...)
	}

	user := User{}
	json.Unmarshal(userAsBytes, &user)

	user.Assets = append(user.Assets,args[1])

	asseti.Owner=newOwner
	asseti.OwnerName=user.Name
	asseti.Customer=CustomerRelation{}


	assetAsBytes, _ = json.Marshal(asseti)
	error := APIstub.PutState(args[1], assetAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to update asset owner in asset"))
	}

	oldAsBytes, _ = json.Marshal(old)
	error = APIstub.PutState(oldid, oldAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed update old owner"))
	}

	userAsBytes, _ = json.Marshal(user)
	error = APIstub.PutState(newOwner, userAsBytes)
	if error != nil {
		return shim.Error(fmt.Sprintf("Failed to add asset in user"))
	}


	return shim.Success(nil)
}
