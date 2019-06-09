import React, { Component } from 'react';
import { Animation, MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow } from "mdbreact";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import classnames from 'classnames';
import PanelHeading from "../components/PanelHeading";
import { Row, Col } from 'react-bootstrap'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import Select from 'react-select';
import PropTypes from 'prop-types';

class BSTable extends React.Component {

    activateUser = async e => {
        var adminId = sessionStorage.getItem("user");
        var id = this.props.data.id;
        e.preventDefault();
        const response = await fetch('/toggle_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: adminId.concat('~',id,'~',"activate") })
        });
        const body = await response.json();
        this.setState({ responseToPost: body });
        console.log(body);
        if(body.express.status===1){
            window.location.reload();
            document.getElementById("statusActivateError").style.display = 'none';
        }else{
            document.getElementById("statusActivateError").style.display = 'block';
        }
    }

    suspendUser = async e => {
        var adminId = sessionStorage.getItem("user");
        var id = this.props.data.id;
        e.preventDefault();
        const response = await fetch('/toggle_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: adminId.concat('~',id,'~',"suspend") })
        });
        const body = await response.json();
        this.setState({ responseToPost: body });
        console.log(body);
        if(body.express.status===1){
            window.location.reload();
            document.getElementById("statusSuspendError").style.display = 'none';
        }else{
            console.log("error");
            document.getElementById("statusSuspendError").style.display = 'block';
        }
    }

    render() {
        if (this.props.data) {
            if(this.props.data.id.substring(0,5)==="admin"){
                if(this.props.data.status==="suspended"){
                    return (
                        <MDBContainer>
                            <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                                <Animation  type="fadeIn">
                                    <MDBCardHeader> Admin Details</MDBCardHeader>
                                    <MDBCardBody className="text-info">

                                        <MDBRow className="justify-content-center">
                                            <MDBListGroup className="my-4 mx-4" style={{ width: "25rem",wordwrap: "break-word"  }}>
                                                <MDBListGroupItem color="primary">Email: {this.props.data.email}</MDBListGroupItem>
                                                <MDBListGroupItem color="primary">CNIC: {this.props.data.cnic}</MDBListGroupItem>
                                            </MDBListGroup>
                                        </MDBRow>
                                        <MDBRow className="justify-content-center">
                                            <MDBBtn size="sm" color="primary" onClick={this.activateUser}>Activate</MDBBtn>
                                        </MDBRow>
                                    </MDBCardBody>
                                </Animation>
                            </MDBCard>
                        </MDBContainer>
                    );
                }else{
                    return (
                        <MDBContainer>
                            <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                                <Animation  type="fadeIn">
                                    <MDBCardHeader> User Details</MDBCardHeader>
                                    <MDBCardBody className="text-info">

                                        <MDBRow className="justify-content-center">
                                            <MDBListGroup className="my-4 mx-4" style={{ width: "25rem",wordwrap: "break-word"  }}>
                                                <MDBListGroupItem color="primary">Name: {this.props.data.name}</MDBListGroupItem>
                                                <MDBListGroupItem color="primary">CNIC: {this.props.data.cnic}</MDBListGroupItem>
                                            </MDBListGroup>
                                        </MDBRow>
                                        <MDBRow className="justify-content-center">
                                            <MDBBtn size="sm" color="primary" onClick={this.suspendUser}>Suspend</MDBBtn>
                                        </MDBRow>
                                    </MDBCardBody>
                                </Animation>
                            </MDBCard>
                        </MDBContainer>
                    );
                }
            }else{
                if(this.props.data.status==="suspended"){
                    return (
                        <MDBContainer>

                            <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                                <Animation  type="fadeIn">
                                    <MDBCardHeader> User Details</MDBCardHeader>
                                    <MDBCardBody className="text-info">
                                        <MDBRow className="justify-content-center">
                                            <MDBListGroup className="my-4 mx-4" style={{ width: "25rem",wordwrap: "break-word"  }}>
                                                <MDBListGroupItem color="primary">License Number: {this.props.data.license}</MDBListGroupItem>
                                                <MDBListGroupItem color="primary">Owner Address: {this.props.data.owneraddress}</MDBListGroupItem>
                                            </MDBListGroup>
                                            <MDBListGroup className="my-4 mx-4" style={{ width: "25rem",wordwrap: "break-word" }}>
                                                <MDBListGroupItem color="primary">Owner Name: {this.props.data.ownername}</MDBListGroupItem>
                                                <MDBListGroupItem color="primary">Owner CNIC: {this.props.data.ownercnic}</MDBListGroupItem>
                                            </MDBListGroup>
                                        </MDBRow>
                                        <MDBRow className="justify-content-center">
                                            <MDBBtn size="sm" color="primary" onClick={this.activateUser}>Activate</MDBBtn>
                                        </MDBRow>
                                    </MDBCardBody>
                                </Animation>
                            </MDBCard>
                        </MDBContainer>
                    );
                }else{
                    return (
                        <MDBContainer>
                            
                            <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                                <Animation  type="fadeIn">
                                    <MDBCardHeader> User Details</MDBCardHeader>
                                    <MDBCardBody className="text-info">
                                        <MDBRow className="justify-content-center">
                                            <MDBListGroup className="my-4 mx-4" style={{ width: "25rem",wordwrap: "break-word"  }}>
                                                <MDBListGroupItem color="primary">License Number: {this.props.data.license}</MDBListGroupItem>
                                                <MDBListGroupItem color="primary">Owner Address: {this.props.data.owneraddress}</MDBListGroupItem>
                                            </MDBListGroup>
                                            <MDBListGroup className="my-4 mx-4" style={{ width: "25rem",wordwrap: "break-word" }}>
                                                <MDBListGroupItem color="primary">Owner Name: {this.props.data.ownername}</MDBListGroupItem>
                                                <MDBListGroupItem color="primary">Owner CNIC: {this.props.data.ownercnic}</MDBListGroupItem>
                                            </MDBListGroup>
                                        </MDBRow>
                                        <MDBRow className="justify-content-center">
                                            <MDBBtn size="sm" color="primary" onClick={this.suspendUser}>Suspend</MDBBtn>
                                        </MDBRow>
                                    </MDBCardBody>
                                </Animation>
                            </MDBCard>
                        </MDBContainer>
                    );
                }
            }
        } else {
            return (
                <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                    <MDBCardHeader>User Details</MDBCardHeader>
                    <MDBCardBody className="text-info">
                        <center><MDBCardText>Details not found!!!</MDBCardText></center>
                    </MDBCardBody>
                </MDBCard>
            );
        }
    }
}

const userTypes = [
    { label: "Manufacturer", value: 1 },
    { label: "Distributor", value: 2 },
    { label: "Chemist", value: 3 },
];

//updating Ahmad Shahid
class CheckboxFilter extends React.Component {
    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
        this.isFiltered = this.isFiltered.bind(this);
    }

    filter(event) {
        if (this.refs.nokCheckbox.checked && this.refs.okCheckbox.checked) {
            // all checkboxes are checked means we want to remove the filter for this column
            this.props.filterHandler();
        } else {
            this.props.filterHandler({ callback: this.isFiltered });
        }
    }

    isFiltered(targetValue) {
        if (targetValue === 'suspended') {
            return (this.refs.nokCheckbox.checked);
        } else {
            return (this.refs.okCheckbox.checked);
        }
    }

    render() {
        return (
            <div>
                <input ref='okCheckbox' type='checkbox' className='filter' onChange={ this.filter } defaultChecked={ true } /><label>{ this.props.textActive }</label>
                <input ref='nokCheckbox' type='checkbox' className='filter' onChange={ this.filter } defaultChecked={ true } style={ { marginLeft: 30 + 'px' } } /><label>{ this.props.textSuspended }</label>
            </div>
        );
    }
}

CheckboxFilter.propTypes = {
    filterHandler: PropTypes.func.isRequired,
    textActive: PropTypes.string,
    textSuspended: PropTypes.string
};

CheckboxFilter.defaultProps = {
    textActive: 'Active',
    textSuspended: 'Suspended'
};

function getCustomFilter(filterHandler, customFilterParameters) {
    return (
        <CheckboxFilter filterHandler={ filterHandler } textActive={ customFilterParameters.textActive } textSuspended={ customFilterParameters.textSuspended } />
    );
}
//updating Ahmad Shahid

class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.activeTab="1";
        this.state.isUserPaneOpen=false;
        this.state.response="";
        this.state.responseToPost={};
        this.state.post="";
        this.state.count={chemistcount:0, distributorcount:0, manufacturercount:0, admincount:0};
        this.state.id="";
        this.state.adminId="";
        this.state.users = { manufacturers:[], distributors:[], chemists:[], admins:[], adminlogs:[] };
        ////////////////////////User////////////////////
        this.state.typeValue="";
        this.state.compNameValue="";
        this.state.addressValue="";
        this.state.licenseValue="";
        this.state.ownerName="";
        this.state.ownerCnic="";
        this.state.ownerAddress="";
        this.state.ownerEmail="";
        this.state.formErrors={typeVal:'', nameVal:'', addVal:'', licVal:'', ownerVal:'', cnicVal:'', ownerAddVal:'', ownerEmailVal:''};
        this.state.formValid=false;
        this.state.typeValid=false;
        this.state.nameValid=false;
        this.state.addressValid=false;
        this.state.licenseValid=false;
        this.state.ownerNameValid=false;
        this.state.ownerCnicValid=false;
        this.state.ownerAddValid=false;
        this.state.ownerEmailValid=false;

        ////////////////////////Admin////////////////////
        this.state.isAdminPaneOpen=false;
        this.state.adminNameValue="";
        this.state.adminCNICValue="";
        this.state.adminEmailValue="";
        this.state.adminFormErrors={adminNameVal:'', adminCNICVal:'', adminEmailVal:''};
        this.state.adminFormValid=false;
        this.state.adminNameValid=false;
        this.state.adminCNICValid=false;
        this.state.adminEmailValid=false;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleChange = (selectedOption) => {
        this.setState({ typeValue: selectedOption, typeValid:true });
        console.log(selectedOption.value);
        if(selectedOption.value===1){
            this.setState({id:"manuf"+this.state.count.manufacturercount});
            console.log("manuf"+this.state.count.manufacturercount);
        } else if(selectedOption.value===2){
            this.setState({id:"dist"+this.state.count.distributorcount});
            console.log("dist"+this.state.count.distributorcount);
        } else if(selectedOption.value===3){
            this.setState({id:"chem"+this.state.count.chemistcount});
            console.log("chem"+this.state.count.chemistcount);
        }
    }

    redirectUser = (path) => {
        this.props.history.push(path);
    }

    componentDidMount() {
        var user = null;
        if(sessionStorage.getItem("user")){
            user = sessionStorage.getItem("user");
            if(user.substring(0,4)==="chem"){
                this.redirectUser('/login/chem');
            }else if(user.substring(0,4)==="manu"){
                this.redirectUser('/login/manufac');
            }else if(user.substring(0,4)==="dist"){
                this.redirectUser('/login/dist');
            }else{
                this.setState({userID:user});
            }
        }else{
            this.redirectUser('/');
        }
        this.callGetAllUsers()
        .then(res => this.setState({ users: res.express }))
        .catch(err => console.log(err));
    }

    callGetAllUsers = async () => {
        const response = await fetch('/get_all_users');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    isExpandableRow(row) {
        return true;
    }

    expandComponent(row) {
        return (
            <BSTable data={ row } />
        );
    }

    closeUserPanel = () => {
        this.setState({
            isUserPaneOpen: false,
            typeValue:null,
            compNameValue:'',
            addressValue:'',
            licenseValue:'',
            ownerName:'',
            ownerCnic:'',
            ownerAddress:'',
            ownerEmail:'',
            formErrors:{typeVal:'', nameVal:'', addVal:'', licVal:'', ownerVal:'', cnicVal:'', ownerAddVal:'', ownerEmailVal:''},
            formValid:false,
            typeValid:false,
            nameValid:false,
            addressValid:false,
            licenseValid:false,
            ownerNameValid:false,
            ownerCnicValid:false,
            ownerAddValid:false,
            ownerEmailValid:false,
        });
    };

    isPositiveInteger(n) {
        return parseFloat(n) === n >>> 0;
    }

    /////////////////////////////////////////////////////////////
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        },()=>{this.validate(name,value)});
    };

    //updating Ahmad Shahid
    validate(name,value){
        var fieldErrors=this.state.formErrors;
        var adminfieldErrors=this.state.adminFormErrors;
        var length=null;
        switch(name){
            case 'compNameValue':
                fieldErrors.nameVal = value.length > 0 ? true : false;
                this.setState({ nameValid:fieldErrors.nameVal });
                break;
            case 'addressValue':
                fieldErrors.addVal = value.length > 0 ? true : false;
                this.setState({ addressValid:fieldErrors.addVal });
                break;
            case 'licenseValue':
                fieldErrors.licVal = value.length > 0 ? true : false;
                this.setState({ licenseValid:fieldErrors.licVal });
                break;
            case 'ownerName':
                fieldErrors.ownerVal = value.length > 0 ? true : false;
                this.setState({ ownerNameValid:fieldErrors.ownerVal });
                break;
            case 'ownerCnic':
                fieldErrors.cnicVal = /^\d{5}-\d{7}-\d{1}$/.test(value) ? true : false;
                this.setState({ ownerCnicValid:fieldErrors.cnicVal });
                break;
            case 'ownerAddress':
                fieldErrors.ownerAddVal = value.length > 0 ? true : false;
                this.setState({ ownerAddValid:fieldErrors.ownerAddVal });
                break;
            case 'ownerEmail':
                fieldErrors.ownerEmailVal = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? true : false;
                this.setState({ ownerEmailValid:fieldErrors.ownerEmailVal });
                break;
            case 'adminNameValue':
                adminfieldErrors.adminNameVal = value.length > 0 ? true : false;
                this.setState({ adminNameValid:adminfieldErrors.adminNameVal });
                break;
            case 'adminCNICValue':
                adminfieldErrors.adminCNICVal = /^\d{5}-\d{7}-\d{1}$/.test(value) ? true : false;
                this.setState({ adminCNICValid:adminfieldErrors.adminCNICVal });
                break;
            case 'adminEmailValue':
                adminfieldErrors.adminEmailVal = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? true : false;
                this.setState({ adminEmailValid:adminfieldErrors.adminEmailVal });
                break;
            default:
                console.log("Invalid Feild");
        }

        this.setState({
            formErrors: fieldErrors,
            nameValid:fieldErrors.nameVal,
            addressValid:fieldErrors.addVal,
            licenseValid:fieldErrors.licVal,
            ownerNameValid:fieldErrors.ownerVal,
            ownerCnicValid:fieldErrors.cnicVal,
            ownerAddValid:fieldErrors.ownerAddVal,
            ownerEmailValid:fieldErrors.ownerEmailVal,
            adminFormErrors:adminfieldErrors,
            adminNameValid:adminfieldErrors.adminNameVal,
            adminCNICValid:adminfieldErrors.adminCNICVal,
            adminEmailValid:adminfieldErrors.adminEmailVal,
        }, this.validateForm );
    }

    validateForm() {
        this.setState({formValid: this.state.nameValid && this.state.ownerEmailValid && this.state.addressValid && this.state.licenseValid && this.state.ownerNameValid && this.state.ownerCnicValid && this.state.ownerAddValid && this.state.typeValid });
        this.setState({adminFormValid: this.state.adminNameValid && this.state.adminCNICValid && this.state.adminEmailValid});
    }
    //updating Ahmad Shahid

    //tasks.map((task) => task.name )
    //updating Ahmad Shahid
    generatePassword = () => {
        var length = 4,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    handleSubmit = async e => {
        /////////////////////////////////////ckeck if user is manuf/dist/chem
        var type=this.state.typeValue.value;
        var comp=this.state.compNameValue;
        var address=this.state.addressValue;
        var license=this.state.licenseValue;
        var owner=this.state.ownerName;
        var cnic=this.state.ownerCnic;
        var ownerAddress=this.state.ownerAddress;
        var email=this.state.ownerEmail;
        var id = this.state.id;
        var password = this.generatePassword();
        var adminId = sessionStorage.getItem("user");
        //console.log("password",password);
        if(type===1){
            console.log('Manufac');
            console.log(id);
            this.closeUserPanel();
            e.preventDefault();
            const response = await fetch('/add_manufacturer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post: comp.concat('~',address,'~',license,'~',owner,'~',cnic,'~',ownerAddress,'~',email,'~',password,'~',id,'~',adminId) })
            });
            const body = await response.json();
            if(body.express.status===1){
                this.handleAddManufacturer(id, comp, address, license, owner, cnic, ownerAddress, email);
                this.setState({ responseToPost: body });
                document.getElementById("addError").style.display = 'none';
                document.getElementById("addSucces").style.display = 'block';
            }else{
                document.getElementById("addError").style.display = 'block';
                document.getElementById("addSucces").style.display = 'none';
            }
        }
        else if(type===2){
            console.log('dist');
            console.log(id);
            this.closeUserPanel();
            e.preventDefault();
            const response = await fetch('/add_distributor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post: comp.concat('~',address,'~',license,'~',owner,'~',cnic,'~',ownerAddress,'~',email,'~',password,'~',id,'~',adminId) })
            });
            const body = await response.json();
            if(body.express.status===1){
                this.handleAddDistributor(id, comp, address, license, owner, cnic, ownerAddress, email);
                this.setState({ responseToPost: body });
                document.getElementById("addError").style.display = 'none';
                document.getElementById("addSucces").style.display = 'block';
            }else{
                document.getElementById("addError").style.display = 'block';
                document.getElementById("addSucces").style.display = 'none';
            }
        }
        else if(type===3){
            console.log('chem');
            console.log(id);
            this.closeUserPanel();
            e.preventDefault();
            const response = await fetch('/add_chemist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post: comp.concat('~',address,'~',license,'~',owner,'~',cnic,'~',ownerAddress,'~',email,'~',password,'~',id,'~',adminId) })
            });
            const body = await response.json();
            if(body.express.status===1){
                this.handleAddChemist(id, comp, address, license, owner, cnic, ownerAddress, email);
                this.setState({ responseToPost: body });
                document.getElementById("addError").style.display = 'none';
                document.getElementById("addSucces").style.display = 'block';
            }else{
                document.getElementById("addError").style.display = 'block';
                document.getElementById("addSucces").style.display = 'none';
            }
        }
    };
    //updating Ahmad Shahid

    handleAddManufacturer(id, comp, address, license, owner, cnic, ownerAddress,email) {
        var asset = {
            index: (this.state.users.manufacturers.length+1),
            id: id,
            name:comp,
            address: address,
            license: license,
            ownername:owner,
            ownercnic:cnic,
            owneraddress: ownerAddress,
            owneremail:email,
            status:"active",
        }
        this.state.users.manufacturers.push(asset);
        this.setState(this.state.users);
    };

    handleAddDistributor(id, comp, address, license, owner, cnic, ownerAddress,email) {
        var asset = {
            index: (this.state.users.distributors.length+1),
            id: id,
            name:comp,
            address: address,
            license: license,
            ownername:owner,
            ownercnic:cnic,
            owneraddress: ownerAddress,
            owneremail:email,
            status:"active",
        }
        this.state.users.distributors.push(asset);
        this.setState(this.state.users);
    };

    onAddUser=()=>{
        this.setState({ isUserPaneOpen: true });
        this.getAllCounts()
        .then(res => this.setState({ count: res.express }))
        .catch(err => console.log(err));
    }

    getAllCounts = async () => {
        const response = await fetch('/get_statics');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log(body);
        return body;
    };

    handleAddChemist(id, comp, address, license, owner, cnic, ownerAddress,email) {
        var asset = {
            index: (this.state.users.chemists.length+1),
            id: id,
            name:comp,
            address: address,
            license: license,
            ownername:owner,
            ownercnic:cnic,
            owneraddress: ownerAddress,
            owneremail:email,
            status:"active",
        }
        this.state.users.chemists.push(asset);
        this.setState(this.state.users);
    };

    // this.setState({
    //     items: update(this.state.items, {1: {name: {$set: 'updated field name'}}})
    // })

    //height='240' scrollTop={ 'Top' }

    //updating Ahmad Shahid
    onAddAdmin=()=>{
        this.setState({ isAdminPaneOpen: true });
        this.getAllCounts()
        .then(res => this.setState({ count: res.express }))
        .catch(err => console.log(err));
    }

    closeAdminPanel = () => {
        this.setState({
            isAdminPaneOpen: false,
            adminNameValue:'',
            adminCNICValue:'',
            adminEmailValue:'',
            adminFormErrors:{adminNameVal:'', adminCNICVal:'', adminEmailVal:''},
            adminFormValid:false,
            adminNameValid:false,
            adminCNICValid:false,
            adminEmailValid:false,
        });
    };

    handleAdminSubmit = async e => {
        var name=this.state.adminNameValue;
        var cnic=this.state.adminCNICValue;
        var email=this.state.adminEmailValue;
        var password = this.generatePassword();
        var id = "admin"+this.state.count.admincount;
        var adminId=this.state.userID;
        console.log('Admin');
        this.closeAdminPanel();
        e.preventDefault();
        const response = await fetch('/add_admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: name.concat('~',cnic,'~',email,'~',password,'~',id, '~', adminId) })
        });
        const body = await response.json();
        if(body.express.status===1){
            this.handleAddAdmin(id,name, cnic, email);
            this.setState({ responseToPost: body });
            document.getElementById("addError").style.display = 'none';
            document.getElementById("addSucces").style.display = 'block';
        }else{
            document.getElementById("addError").style.display = 'block';
            document.getElementById("addSucces").style.display = 'none';
        }
    }

    handleAddAdmin(id,name, cnic, email) {
        var asset = {
            index: (this.state.users.admins.length+1),
            id:id,
            name: name,
            cnic: cnic,
            email: email,
            status:"active",
        }
        this.state.users.admins.push(asset);
        this.setState(this.state.users);
    };

    handleAdminLogSubmit = async e => {

    }

    handleAddAdminLog(name, description) {
        var asset = {
            index: (this.state.users.adminlogs.length+1),
            name: name,
            description: description,
        }
        this.state.users.adminlogs.push(asset);
        this.setState(this.state.users.adminlogs);
    };
    //updating Ahmad Shahid

    render() {
        const manufOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.users.manufacturers.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }
        const distOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.users.distributors.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }
        const chemOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.users.chemists.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }
        const adminOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.users.admins.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }
        const adminLogOptions = {
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.users.adminlogs.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        return (
            <MDBContainer>
                <PanelHeading title="Super Admin Panel"/>
                <label id="statusActivateError" style={{display:"none", color:"red"}}>Error: Cannot Activate User.</label>
                <label id="statusSuspendError" style={{display:"none", color:"red"}}>Error: Cannot Suspend User.</label>
                <label id="addError" style={{display:"none", color:"red"}}>Error: Couldnot add user. Serverside Error!!!</label>
                <label id="addSucces" style={{display:"none", color:"green"}}>Successfully added user!!!</label>
                {/* Add User side pane */}
                <SlidingPane closeIcon={<div style={{color:"red"}}>[ X ]</div>} isOpen={this.state.isUserPaneOpen} title='Add User' from='right' width='400px' onRequestClose={this.closeUserPanel}>
                    <form onSubmit={this.handleSubmit}>
                        <Select required className={this.state.typeValid ? "success" : "error"} placeholder="User Type" options={userTypes} value={this.state.typeValue} onChange={this.handleChange}></Select>
                        <MDBInput required id={this.state.nameValid ? "success" : "error"} label="Company Name" name="compNameValue" value={this.state.compNameValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.addressValid ? "success" : "error"} type="text" label="Company Address" name="addressValue" value={this.state.addressValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.licenseValid ? "success" : "error"} label="License Number" name="licenseValue" type="text" value={this.state.licenseValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.ownerNameValid ? "success" : "error"} label="Owner Name"  name="ownerName" type="text" value={this.state.ownerName} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.ownerCnicValid ? "success" : "error"} label="Owner CNIC"  name="ownerCnic" type="tel" value={this.state.ownerCnic} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.ownerAddValid ? "success" : "error"} type="text" label="Owner Address" name="ownerAddress" value={this.state.ownerAddress} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.ownerEmailValid ? "success" : "error"} label="Email" name="ownerEmail" type="email" value={this.state.ownerEmail} onChange={this.handleInputChange}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" disabled={!this.state.formValid} >Add</MDBBtn></center>
                    </form>
                </SlidingPane>

                {/* updating Ahmad Shahid */}
                <SlidingPane closeIcon={<div style={{color:"red"}}>[ X ]</div>} isOpen={this.state.isAdminPaneOpen} title='Add Admin' from='right' width='400px' onRequestClose={this.closeAdminPanel}>
                    <form onSubmit={this.handleAdminSubmit}>
                        <MDBInput required id={this.state.adminNameValid ? "success" : "error"} label="Admin Name" name="adminNameValue" value={this.state.adminNameValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.adminCNICValid ? "success" : "error"} type="text" label="CNIC" name="adminCNICValue" value={this.state.adminCNICValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.adminEmailValid ? "success" : "error"} label="Email" name="adminEmailValue" type="email" value={this.state.adminEmailValue} onChange={this.handleInputChange}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" disabled={!this.state.adminFormValid} >Add</MDBBtn></center>
                    </form>
                </SlidingPane>
                {/* updating Ahmad Shahid */}

                <Nav tabs pills>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>Manufacturer</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>Distributor</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>Chemist</NavLink>
                    </NavItem>
                    {/* updating Ahmad Shahid */}
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '4' })} onClick={() => { this.toggle('4'); }}>Admin</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '5' })} onClick={() => { this.toggle('5'); }}>Activity Log</NavLink>
                    </NavItem>
                    {/* updating Ahmad Shahid */}
                    <NavItem>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </NavItem>
                    <NavItem>
                        <MDBBtn size="sm" color="primary" onClick={this.onAddUser} >Create User</MDBBtn>
                    </NavItem>
                    <NavItem>
                        <MDBBtn size="sm" color="primary" onClick={this.onAddAdmin} >Create Admin</MDBBtn>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Animation type="fadeIn">
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={ this.state.users.manufacturers } version='4' hover condensed pagination options={ manufOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } >
                                        <TableHeaderColumn isKey dataField='index' width='70'>No.</TableHeaderColumn>
                                        <TableHeaderColumn dataField='id' width='70'>Manufacturer ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Company Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='address' filter={{ type: 'TextFilter', delay: 100 }}>Company Address</TableHeaderColumn>
                                        <TableHeaderColumn dataField='status' filter={ { type: 'CustomFilter', getElement: getCustomFilter, customFilterParameters: { textActive: 'Active', textSuspended: 'Suspended' } } }>Status</TableHeaderColumn>
                                    </BootstrapTable>
                                    <br/><br/>
                                </Col>
                            </Row>
                        </Animation>
                    </TabPane>
                    <TabPane tabId="2">
                        <Animation type="fadeIn">
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={ this.state.users.distributors } version='4' hover condensed pagination options={ distOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } >
                                        <TableHeaderColumn isKey dataField='index' width='70'>No.</TableHeaderColumn>
                                        <TableHeaderColumn dataField='id' width='70'>Distributor ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Company Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='address' filter={{ type: 'TextFilter', delay: 100 }}>Company Address</TableHeaderColumn>
                                        <TableHeaderColumn dataField='status' filter={ { type: 'CustomFilter', getElement: getCustomFilter, customFilterParameters: { textActive: 'Active', textSuspended: 'Suspended' } } }>Status</TableHeaderColumn>
                                    </BootstrapTable>
                                    <br/><br/>
                                </Col>
                            </Row>
                        </Animation>
                    </TabPane>
                    <TabPane tabId="3">
                        <Animation type="fadeIn">
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={ this.state.users.chemists } version='4' hover condensed pagination options={ chemOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent }>
                                        <TableHeaderColumn isKey dataField='index' width='70'>No.</TableHeaderColumn>
                                        <TableHeaderColumn dataField='id' width='70'>Chemist ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Company Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='address' filter={{ type: 'TextFilter', delay: 100 }}>Company Address</TableHeaderColumn>
                                        <TableHeaderColumn dataField='status' filter={ { type: 'CustomFilter', getElement: getCustomFilter, customFilterParameters: { textActive: 'Active', textSuspended: 'Suspended' } } }>Status</TableHeaderColumn>
                                    </BootstrapTable>
                                    <br/><br/>
                                </Col>
                            </Row>
                        </Animation>
                    </TabPane>
                    {/* updating Ahmad Shahid */}
                    <TabPane tabId="4">
                        <Animation type="fadeIn">
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={ this.state.users.admins } version='4' hover condensed pagination options={ adminOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent }>
                                        <TableHeaderColumn isKey dataField='index' width='70'>No.</TableHeaderColumn>
                                        <TableHeaderColumn dataField='id' width='70'>Admin ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='status' filter={ { type: 'CustomFilter', getElement: getCustomFilter, customFilterParameters: { textActive: 'Active', textSuspended: 'Suspended' } } }>Status</TableHeaderColumn>
                                    </BootstrapTable>
                                    <br/><br/>
                                </Col>
                            </Row>
                        </Animation>
                    </TabPane>
                    <TabPane tabId="5">
                        <Animation type="fadeIn">
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={ this.state.users.adminlogs } version='4' hover condensed pagination options={ adminLogOptions } >
                                        <TableHeaderColumn isKey dataField='index' width='70'>No.</TableHeaderColumn>
                                        <TableHeaderColumn dataField='id' width='90'>Log ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='adminId' width='70'>Admin ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name' width='200' filter={{ type: 'TextFilter', delay: 100 }}>Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='description'>Description</TableHeaderColumn>
                                    </BootstrapTable>
                                    <br/><br/>
                                </Col>
                            </Row>
                        </Animation>
                    </TabPane>
                    {/* updating Ahmad Shahid */}
                </TabContent>
            </MDBContainer>
        );
    }
}

export default AdminPanel;
