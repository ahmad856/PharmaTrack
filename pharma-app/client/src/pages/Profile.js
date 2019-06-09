import React, { Component } from 'react';
import {MDBIcon,MDBCol, MDBTable,MDBTableBody, MDBTableHead, MDBContainer, MDBInput, MDBBtn, MDBRow } from "mdbreact";
import PanelHeading from "../components/PanelHeading";
import 'react-sliding-pane/dist/react-sliding-pane.css';
import SlidingPane from 'react-sliding-pane';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.UserID = "";
        this.state.userId = "";
        this.state.user = {};
        this.state.user.address = "";
        this.state.user.assets = [];
        this.state.user.chemists = [];
        this.state.user.distributors = [];
        this.state.user.id = "";
        this.state.user.license = "";
        this.state.user.name = "";
        this.state.user.owneraddress = "";
        this.state.user.ownercnic = "";
        this.state.user.ownername = "";
        this.state.user.password = "";

        ///////////////////////////////////////////user
        this.state.companyName = "";

        this.state.companyAdd = "";
        this.state.ownerName = "";
        this.state.ownerCNIC = "";
        this.state.ownerAdd = "";
        this.state.ownerPassword = "";
        this.state.ownerEmail = "";

        this.state.isPaneOpen = false;
        this.state.isAdminPaneOpen = false;
        this.state.formErrors={companyAddVal:'', ownerNameVal:'', ownerCNICVal:'', ownerAddVal:'', ownerPasswordVal:'', ownerEmailVal:''};
        this.state.formValid=false;

        this.state.companyAddValid=false;
        this.state.ownerNameValid=false;
        this.state.ownerCnicValid=false;
        this.state.ownerAddValid=false;
        this.state.ownerEmailValid=false;
        this.state.ownerPasswordValid=false;

        /////////////////////////////////////////admin
        this.state.adminName="";
        this.state.adminCNIC="";
        this.state.adminEmail="";
        this.state.adminPassword="";
        this.state.adminFormErrors={adminNameVal:true, adminCNICVal:true, adminEmailVal:true,adminPasswordVal:false};
        this.state.adminFormValid=false;
        this.state.adminNameValid=true;
        this.state.adminCNICValid=true;
        this.state.adminEmailValid=true;
        this.state.adminPasswordValid=false;

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        },()=>{this.validate(name,value)});
    };

    validate(name,value){
        var fieldErrors=this.state.formErrors;
        var adminfieldErrors=this.state.adminFormErrors;
        var length=null;
        switch(name){
            case 'companyAdd':
                fieldErrors.companyAddVal = value.length > 0 ? true : false;
                this.setState({ companyAddValid:fieldErrors.companyAddVal });
                break;
            case 'ownerName':
                fieldErrors.ownerNameVal = value.length > 0 ? true : false;
                this.setState({ ownerNameValid:fieldErrors.ownerNameVal });
                break;
            case 'ownerCnic':
                fieldErrors.ownerCNICVal = /^\d{5}-\d{7}-\d{1}$/.test(value) ? true : false;
                this.setState({ ownerCnicValid:fieldErrors.ownerCNICVal });
                break;
            case 'ownerAdd':
                fieldErrors.ownerAddVal = value.length > 0 ? true : false;
                this.setState({ ownerAddValid:fieldErrors.ownerAddVal });
                break;
            case 'ownerEmail':
                fieldErrors.ownerEmailVal = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? true : false;
                this.setState({ ownerEmailValid:fieldErrors.ownerEmailVal });
                break;
            case 'ownerPassword':
                fieldErrors.ownerPasswordVal = value.length > 4 ? true : false;
                this.setState({ ownerPasswordValid:fieldErrors.ownerPasswordVal });
                break;

            case 'adminName':
                adminfieldErrors.adminNameVal = value.length > 0 ? true : false;
                this.setState({ adminNameValid:adminfieldErrors.adminNameVal });
                break;
            case 'adminCNIC':
                adminfieldErrors.adminCNICVal = /^\d{5}-\d{7}-\d{1}$/.test(value) ? true : false;
                this.setState({ adminCNICValid:adminfieldErrors.adminCNICVal });
                break;
            case 'adminEmail':
                adminfieldErrors.adminEmailVal = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? true : false;
                this.setState({ adminEmailValid:adminfieldErrors.adminEmailVal });
                break;
            case 'adminPassword':
                adminfieldErrors.adminPasswordVal = value.length > 4 ? true : false;
                this.setState({ adminPasswordValid:adminfieldErrors.adminPasswordVal });
                break;
            default:
                console.log("Invalid Feild");
        }

        this.setState({
            formErrors: fieldErrors,
            companyAddValid:fieldErrors.companyAddVal,
            ownerNameValid:fieldErrors.ownerNameVal,
            ownerCnicValid:fieldErrors.ownerCnicVal,
            ownerAddValid:fieldErrors.ownerAddVal,
            ownerEmailValid:fieldErrors.ownerEmailVal,
            ownerPasswordValid:fieldErrors.ownerPasswordVal,

            adminFormErrors:adminfieldErrors,
            adminNameValid:adminfieldErrors.adminNameVal,
            adminCNICValid:adminfieldErrors.adminCNICVal,
            adminEmailValid:adminfieldErrors.adminEmailVal,
            adminPasswordValid:adminfieldErrors.adminPasswordVal,
        }, this.validateForm );
    }

    validateForm() {
        this.setState({formValid: this.state.companyAddValid && this.state.ownerNameValid && this.state.ownerCnicValid && this.state.ownerAddValid && this.state.ownerEmailValid && this.state.ownerPasswordValid });
        this.setState({adminFormValid: this.state.adminNameValid && this.state.adminCNICValid && this.state.adminEmailValid && this.state.adminPasswordValid});
    }

    redirectUser = (path) => {
        this.props.history.push(path);
    }

    componentDidMount() {
        var user = null;
        if(sessionStorage.getItem("user")){
            user = sessionStorage.getItem("user");
            this.setState({userID:user});
        }else{
            this.redirectUser('/');
        }
        // this.callGetAllAssets()
        // .then(res => this.setState({ assets: this.flattenAssetData(res.express) }))
        // .catch(err => console.log(err));
        this.getUser()
        .then(res => this.setState({
            user: res.express,
            adminName:res.express.name,
            adminEmail:res.express.email,
            adminCNIC:res.express.cnic,

            companyName:res.express.name,
            companyAdd:res.express.address,
            ownerName:res.express.ownername,
            ownerCNIC:res.express.ownercnic,
            ownerAdd:res.express.owneraddress,
         }))
        .catch(err => console.log(err));
    }

    getUser = async () => {
        var id = null;
        if(sessionStorage.getItem("user")){
            id = sessionStorage.getItem("user");
        }
        const response = await fetch('/get_user/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log(body);
        return body;
    };

    closePanel = () => {
        this.setState({ isPaneOpen: false });
    };

    closeAdminPanel = () =>{
        this.setState({ isAdminPaneOpen: false });
    }

    openPanel = () => {
        this.setState({ isPaneOpen: true });
    };

    openAdminPanel = () => {
        this.setState({ isAdminPaneOpen: true });
    };

    updateProfile = async e => {
        var compName=this.state.companyName;
        var compAddr=this.state.companyAdd;
        var ownerName=this.state.ownerName;
        var ownerCNIC=this.state.ownerCNIC;
        var ownerAddr=this.state.ownerAdd;
        var pass=this.state.password;
        var email=this.state.email;
        this.closePanel();
        e.preventDefault();
        // const response = await fetch('/add_asset', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ post: id.concat('~',qr,'~',name,'~',description,'~',owner,'~',type,'~',price,'~',mgfDate,'~',expDate,'~',qty,'~',timestamp) })
        // });
        // const body = await response.json();
        // this.setState({ responseToPost: body });
        // if(body.express.status===1){
        //     this.handleAddAsset(id, qr, name, description, owner, type, price, mgfDate, expDate, qty, timestamp);
        //     document.getElementById("profileUpdateFailure").style.display='none';
        // }else{
        //     document.getElementById("profileUpdateFailure").style.display='block';
        // }
    };

    updateAdminProfile = async e => {
        var id = sessionStorage.getItem("user");
        var name=this.state.adminName;
        var password=this.state.adminPassword;
        var cnic=this.state.adminCNIC;
        var email=this.state.adminEmail;
        this.closeAdminPanel();
        e.preventDefault();
        const response = await fetch('/update_admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: id.concat('~',name,'~',password,'~',cnic,'~',email) })
        });
        const body = await response.json();
        this.setState({ responseToPost: body });
        if(body.express.status===1){
            document.getElementById("profileUpdateFailure2").style.display="none";
            document.getElementById("profileUpdateSuccess").style.display="block";
            var user=this.state.user;
            user.name=this.state.adminName;
            user.cnic=this.state.adminCNIC;
            user.email=this.state.adminEmail;
            this.setState({
                adminPassword:"",
                user:user,
                adminFormErrors:{adminNameVal:true, adminCNICVal:true, adminEmailVal:true,adminPasswordVal:false},
                adminPasswordValid:false
            });
        }else{
            document.getElementById("profileUpdateFailure2").style.display="block";
            document.getElementById("profileUpdateSuccess").style.display="none";
            this.setState({ adminPassword : "" });
        }
    };

    render() {
        if(sessionStorage.getItem("user").substring(0,5)==="admin"){
            return (
                <MDBContainer>
                    <PanelHeading title="Profile Page" />

                    <SlidingPane isOpen={this.state.isAdminPaneOpen} title='Edit Profile' closeIcon={<div style={{color:"red"}}>[ X ]</div>} from='right' width='400px' onRequestClose={this.closeAdminPanel}>
                        <form onSubmit={this.updateAdminProfile}>
                            <MDBInput id={this.state.adminNameValid ? "success" : "error"} label="Owner Name" name="adminName" type="text" value={this.state.adminName} onChange={this.handleInputChange}/>
                            <MDBInput id={this.state.adminCNICValid ? "success" : "error"} label="Owner CNIC" name="adminCNIC" type="text" value={this.state.adminCNIC} onChange={this.handleInputChange}/>
                            <MDBInput id={this.state.adminEmailValid ? "success" : "error"} label="Email" name="adminEmail" type="email" value={this.state.adminEmail} onChange={this.handleInputChange}/>
                            <MDBInput id={this.state.adminPasswordValid ? "success" : "error"} label="Password" name="adminPassword" type="password" value={this.state.adminPassword} onChange={this.handleInputChange}/>
                            <center><MDBBtn size="sm" color="primary" type="submit" disabled={!this.state.adminFormValid}>Update</MDBBtn></center>
                        </form>
                    </SlidingPane>

                    <label id="profileUpdateFailure2" style={{color:"red", display:"none"}}>Cannot Update Profile.</label>
                    <label id="profileUpdateSuccess" style={{color:"green", display:"none"}}>Successfully Updated Profile.</label>
                    <MDBRow md="10">
                        <MDBCol>
                        <h1>{this.state.user.name}</h1>
                        </MDBCol>
                        <MDBCol md="2">
                            <MDBBtn size="md" color="blue" onClick={this.openAdminPanel}>Edit<MDBIcon icon="edit" className="ml-2" /></MDBBtn>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="12">
                            <MDBTable hover responsive>
                                <MDBTableHead></MDBTableHead>
                                <MDBTableBody>
                                    <tr>
                                        <td><strong>Admin Id:</strong></td>
                                        <td>{this.state.user.id}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Admin CNIC:</strong></td>
                                        <td>{this.state.user.cnic}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Admin Email:</strong></td>
                                        <td>{this.state.user.email}</td>
                                    </tr>
                                </MDBTableBody>
                            </MDBTable>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            );
        }else{
            return (
                <MDBContainer>
                    <PanelHeading title="Profile Page" />

                    <SlidingPane isOpen={this.state.isPaneOpen} title='Edit Profile' closeIcon={<div style={{color:"red"}}>[ X ]</div>} from='right' width='400px' onRequestClose={this.closePanel}>
                        <form onSubmit={this.updateProfile}>
                            <MDBInput label="Company Name" value={this.state.companyName}/>
                            <MDBInput id={this.state.companyAddValid ? "success" : "error"} label="Company Address *" name="companyAdd" type="text" value={this.state.companyAdd} onChange={this.handleInputChange}/>
                            <MDBInput id={this.state.ownerNameValid ? "success" : "error"} label="Owner Name *" name="ownerName" type="text" value={this.state.ownerName} onChange={this.handleInputChange}/>
                            <MDBInput id={this.state.ownerAddValid ? "success" : "error"} label="Owner Address *" name="ownerAdd" type="text" value={this.state.ownerAdd} onChange={this.handleInputChange}/>
                            <MDBInput id={this.state.ownerCnicValid ? "success" : "error"} label="Owner CNIC *" name="ownerCNIC" type="text" value={this.state.ownerCNIC} onChange={this.handleInputChange}/>
                            <MDBInput id={this.state.ownerEmailValid ? "success" : "error"} label="Email *" name="email" type="email" value={this.state.ownerEmail} onChange={this.handleInputChange}/>
                            <MDBInput id={this.state.ownerPasswordValid ? "success" : "error"} label="Password *" name="password" type="password" value={this.state.ownerPassword} onChange={this.handleInputChange}/>
                            <center><MDBBtn size="sm" color="primary" type="submit" >Update</MDBBtn></center>
                        </form>
                    </SlidingPane>

                    <label id="profileUpdateFailure2" style={{color:"red", display:"none"}}>Cannot Update Profile.</label>
                    <label id="profileUpdateSuccess" style={{color:"green", display:"none"}}>Successfully Updated Profile.</label>
                    <MDBRow md="10">
                        <MDBCol>
                        <h1>{this.state.user.name}</h1>
                        </MDBCol>
                        <MDBCol md="2">
                            <MDBBtn size="md" color="blue" onClick={this.openPanel}>Edit<MDBIcon icon="edit" className="ml-2" /></MDBBtn>
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol md="12">
                            <MDBTable hover responsive>
                                <MDBTableHead></MDBTableHead>
                                <MDBTableBody>
                                        <tr>
                                            <td width="150px"><strong>Company ID:</strong></td>
                                            <td>{this.state.user.id}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Company Address:</strong></td>
                                            <td>{this.state.user.address}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>License Number:</strong></td>
                                            <td>{this.state.user.license}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Owner Name:</strong></td>
                                            <td>{this.state.user.ownername}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Owner CNIC:</strong></td>
                                            <td>{this.state.user.ownercnic}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Owner Email:</strong></td>
                                            <td>{this.state.user.ownerEmail}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Owner Address:</strong></td>
                                            <td>{this.state.user.owneraddress}</td>
                                        </tr>
                                </MDBTableBody>
                            </MDBTable>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            );
        }
    }
}

export default Profile;
