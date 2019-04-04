import React, { Component } from 'react';
import {MDBIcon,MDBCol, MDBTable,MDBTableBody, MDBTableHead, MDBContainer, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle, MDBInput, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow } from "mdbreact";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
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

        ///////////////////////////////////////////
        this.state.companyName = "";
        this.state.companyAdd = "";
        this.state.ownerName = "";
        this.state.ownerCNIC = "";
        this.state.ownerAdd = "";
        this.state.password = "";
        this.state.isPaneOpen = false;

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

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
        return body;
    };

    closePanel = () => {
        this.setState({ isPaneOpen: false });
    };

    openPanel = () => {
        this.setState({ isPaneOpen: true });
    };

    render() {
        return (
            <MDBContainer>
                <PanelHeading title="Profile Page" />

                <SlidingPane isOpen={this.state.isPaneOpen} title='Edit Profile' closeIcon={<div style={{color:"red"}}>[ X ]</div>} from='right' width='400px' onRequestClose={this.closePanel}>
                    <form>
                        <MDBInput label="Company Name" value={this.state.companyName}/>
                        <MDBInput type="textarea" rows="2" label="Company Address" name="companyAdd" type="text" min="2" value={this.state.companyAdd} onChange={this.handleInputChange}/>
                        <MDBInput label="Owner Name" name="ownerName" type="text" value={this.state.ownerName} onChange={this.handleInputChange}/>
                        <MDBInput label="Owner CNIC" name="ownerCNIC" type="text" value={this.state.ownerCNIC} onChange={this.handleInputChange}/>
                        <MDBInput type="textarea" rows="2" label="Owner Address" name="ownerAdd" min="2" value={this.state.ownerAdd} onChange={this.handleInputChange}/>
                        <MDBInput rows="2" label="Password" name="password" type="password" value={this.state.password} onChange={this.handleInputChange}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" >Update</MDBBtn></center>
                    </form>
                </SlidingPane>

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

export default Profile;
