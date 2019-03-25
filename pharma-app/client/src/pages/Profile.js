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
        this.state.companyName='GlaxoSmithKline';
        this.state.companyId='21232312312';
        this.state.companyAdd='xyz, iuyte, 222, 3dasd, lahore';
        this.state.licenseNumber='576475';
        this.state.ownerName='Mera naam RUMEEL hai, RUMEEL nahi';
        this.state.ownerCNIC='35535-9867554-8';
        this.state.isPaneOpen='';
        this.state.ownerAdd = '530A, Block K, Sabzazar Scheme, Multan Rd, Lahore.';
    }

    closePanel = () => {
        this.setState({ isPaneOpen: false });
    };
    openPanel = () => {
        this.setState({ isPaneOpen: true });
    };

    render() {
        return (
            <div>
                <SlidingPane isOpen={this.state.isPaneOpen} title='Edit Profile' closeIcon={<div style={{color:"red"}}>[ X ]</div>} from='right' width='400px' onRequestClose={this.closePanel}>
                <form>

                        <MDBInput label="Company Name" value={this.state.companyName}/>
                        <MDBInput type="textarea" rows="2" label="Company Address" name="companyAdd" type="text" min="2" value={this.state.companyAdd}/>
                        <MDBInput label="Owner Name"  name="ownerName" type="text" value={this.state.ownerName}/>
                        <MDBInput label="Owner CNIC"  name="ownerCNIC" type="text" value={this.state.ownerCNIC}/>
                        <MDBInput type="textarea" rows="2" label="Owner Address" name="ownerAdd" type="text" min="2" value={this.state.ownerAdd}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" >Update</MDBBtn></center>
                    </form>
                </SlidingPane>
                <MDBContainer>
                    <PanelHeading title="Profile Page" />
                <MDBRow md="10">
                    <MDBCol>
                <h1>{this.state.companyName}</h1>
                </MDBCol>
                <MDBCol md="2">
                <MDBBtn size="md" color="blue" onClick={this.openPanel}>Edit<MDBIcon icon="edit" className="ml-2" /></MDBBtn>
                </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol md="12">
                <MDBTable hover responsive>
                    <MDBTableHead>
                    </MDBTableHead>
                    <MDBTableBody>
                            <tr>
                                <td width="150px"><strong>Company ID:</strong></td>
                                <td>{this.state.companyId}</td>
                            </tr>

                            <tr>
                                <td><strong>Company Address:</strong></td>
                                <td>{this.state.companyAdd}</td>
                            </tr>
                            <tr>
                                <td><strong>License Number:</strong></td>
                                <td>{this.state.licenseNumber}</td>
                            </tr>
                            <tr>
                                <td><strong>Owner Name:</strong></td>
                                <td>{this.state.ownerName}</td>
                            </tr>
                            <tr>
                                <td><strong>Owner CNIC:</strong></td>
                                <td>{this.state.ownerCNIC}</td>
                            </tr>
                            <tr>
                                <td><strong>Owner Address:</strong></td>
                                <td>{this.state.ownerAdd}</td>
                            </tr>

                    </MDBTableBody>
                </MDBTable>
                </MDBCol>
                </MDBRow>
            </MDBContainer>
            </div>
        );

    }
}

export default Profile;
