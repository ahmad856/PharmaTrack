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

class BSTable extends React.Component {
    render() {
        if (this.props.data) {
            return (
                <MDBContainer>
                    <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                        <Animation  type="fadeIn">
                            <MDBCardHeader> User Details</MDBCardHeader>
                            <MDBCardBody className="text-info">
                                <MDBRow className="justify-content-center">
                                    <MDBListGroup className="my-4 mx-4" style={{ width: "20rem",wordwrap: "break-word"  }}>
                                        <MDBListGroupItem color="primary">ID: {this.props.data.id}</MDBListGroupItem>
                                        <MDBListGroupItem color="primary">Company Name: {this.props.data.name}</MDBListGroupItem>
                                        <MDBListGroupItem color="primary">Company Address:<br/> {this.props.data.address}</MDBListGroupItem>
                                        <MDBListGroupItem color="primary">License Number: {this.props.data.license}</MDBListGroupItem>
                                    </MDBListGroup>
                                    <MDBListGroup className="my-4 mx-4" style={{ width: "20rem",wordwrap: "break-word" }}>
                                        <MDBListGroupItem color="primary">Owner Name: {this.props.data.ownername}</MDBListGroupItem>
                                        <MDBListGroupItem color="primary">Owner CNIC: {this.props.data.ownercnic}</MDBListGroupItem>
                                        <MDBListGroupItem color="primary">Owner Address:<br/> {this.props.data.owneraddress}</MDBListGroupItem>
                                    </MDBListGroup>
                                </MDBRow>
                            </MDBCardBody>
                        </Animation>
                    </MDBCard>
                </MDBContainer>
            );
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

class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.activeTab="1";
        this.state.isUserPaneOpen=false;
        this.state.response="";
        this.state.responseToPost="";
        this.state.post="";
        this.state.count="";
        this.state.id="";
        this.state.users = { manufacturers:[], distributors:[], chemists:[]};
        ////////////////////////User////////////////////
        this.state.typeValue="";
        this.state.compNameValue="";
        this.state.addressValue="";
        this.state.licenseValue="";
        this.state.ownerName="";
        this.state.ownerCnic="";
        this.state.ownerAddress="";
        this.state.password="";
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleChange = (selectedOption) => {
        this.setState({ typeValue: selectedOption });
        console.log(this.state.typeValue);
        if(this.state.typeValue.value===0){
            console.log("type value not set.....");
        } else if(this.state.typeValue.value===1){
            this.setState({id:"manuf"+this.state.count.manufacturercount});
            console.log("manuf"+this.state.count.manufacturercount);
        } else if(this.state.typeValue.value===2){
            this.setState({id:"manuf"+this.state.count.distributorcount});
            console.log("dist"+this.state.count.distributorcount);
        } else if(this.state.typeValue.value===3){
            this.setState({id:"manuf"+this.state.count.chemistcount});
            console.log("chem"+this.state.count.chemistcount);
        }
    }

    componentDidMount() {
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
            password:'',
            // errors:{nameVal:'',priceVal:'',typeVal:'',qtyVal:''},
            // nameValid:false,
            // priceValid:false,
            // qtyValid:false,
            // typeValid:false,
            // formValid:false
        });
    };

    /////////////////////////////////////////////////////////////
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };
    //,()=>{this.validate(name,value)}

    validate(name,value){
        var fieldErrors=this.state.errors;
        var nameValid=this.state.nameValid;
        var priceValid=this.state.priceValid;
        var qtyValid=this.state.qtyValid;
        var typeValid=this.state.typeValid;
        switch(name){
            case 'nameValue':
                nameValid = value.length > 0;
                fieldErrors.nameVal = nameValid ? '' : ' is Empty!!!';
                break;
            case 'priceValue':
                priceValid = value.length > 0;
                fieldErrors.priceVal = priceValid ? '' : ' is Empty!!!';
                break;
            case 'typeValue':
                typeValid = value.length > 0;
                fieldErrors.typeVal = typeValid ? '' : ' is Empty!!!';
                break;
            case 'qtyValue':
                qtyValid = value.length > 0;
                fieldErrors.qtyVal = qtyValid ? '' : ' is Empty!!!';
                break;
            default:
                console.log("Invalid Feild");
        }

        this.setState({
            errors: fieldErrors,
            nameValid: nameValid,
            priceValid: priceValid,
            typeValid: typeValid,
            qtyValid: qtyValid,
            }, this.validateF);
    }

    validateF() {
        this.setState({formValid: this.state.nameValid && this.state.priceValid && this.state.qtyValid && this.state.typeValid});
    }
    //tasks.map((task) => task.name )

    handleSubmit = async e => {
        /////////////////////////////////////ckeck if user is manuf/dist/chem
        var type=this.state.typeValue.value;
        var comp=this.state.compNameValue;
        var address=this.state.addressValue;
        var license=this.state.licenseValue;
        var owner=this.state.ownerName;
        var cnic=this.state.ownerCnic;
        var ownerAddress=this.state.ownerAddress;
        var password=this.state.password;
        var id = null;
        if(type===1){
            console.log('Manufac');
            id="manuf"+(this.state.users.manufacturers.length);
            this.handleAddManufacturer(id, comp, address, license, owner, cnic, ownerAddress);
            this.closeUserPanel();
            e.preventDefault();
            const response = await fetch('/add_manufacturer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post: id.concat('~',comp,'~',address,'~',license,'~',owner,'~',cnic,'~',ownerAddress,'~',password) })
            });
            const body = await response.text();
            this.setState({ responseToPost: body });
        }
        else if(type===2){
            console.log('dist');
            id="dist"+(this.state.users.distributors.length);
            this.handleAddDistributor(id, comp, address, license, owner, cnic, ownerAddress);
            this.closeUserPanel();
            e.preventDefault();
            const response = await fetch('/add_distributor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post: id.concat('~',comp,'~',address,'~',license,'~',owner,'~',cnic,'~',ownerAddress,'~',password) })
            });
            const body = await response.text();
            this.setState({ responseToPost: body });
        }
        else if(type===3){
            console.log('chem');
            id="chem"+(this.state.users.chemists.length);
            this.handleAddChemist(id, comp, address, license, owner, cnic, ownerAddress);
            this.closeUserPanel();
            e.preventDefault();
            const response = await fetch('/add_chemist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post: id.concat('~',comp,'~',address,'~',license,'~',owner,'~',cnic,'~',ownerAddress,'~',password) })
            });
            const body = await response.text();
            this.setState({ responseToPost: body });
        }
    };

    handleAddManufacturer(id, comp, address, license, owner, cnic, ownerAddress) {
        var asset = {
            'id': id,
            'name':comp,
            'address': address,
            'licence': license,
            'owner':owner,
            'cnic':cnic,
            'ownerAddress': ownerAddress,
        }
        this.state.users.manufacturers.push(asset);
        this.setState(this.state.users);
    };

    handleAddDistributor(id, comp, address, license, owner, cnic, ownerAddress) {
        var asset = {
            'id': id,
            'name':comp,
            'address': address,
            'licence': license,
            'owner':owner,
            'cnic':cnic,
            'ownerAddress': ownerAddress,
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

    handleAddChemist(id, comp, address, license, owner, cnic, ownerAddress) {
        var asset = {
            'id': id,
            'name':comp,
            'address': address,
            'licence': license,
            'owner':owner,
            'cnic':cnic,
            'ownerAddress': ownerAddress,
        }
        this.state.users.chemists.push(asset);
        this.setState(this.state.users);
    };

    // this.setState({
    //     items: update(this.state.items, {1: {name: {$set: 'updated field name'}}})
    // })

    //height='240' scrollTop={ 'Top' }

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

        return (
            <MDBContainer>
                <PanelHeading title="Super Admin Panel"/>
                {/* Add UuserTSer side pane */}

                <SlidingPane closeIcon={<div style={{color:"red"}}>[ X ]</div>} isOpen={this.state.isUserPaneOpen} title='Add User' from='right' width='400px' onRequestClose={this.closeUserPanel}>
                    <form onSubmit={this.handleSubmit}>
                        <Select  placeholder="User Type" options={userTypes} value={this.state.typeValue} onChange={this.handleChange}></Select>
                        <MDBInput disabled label="User ID" name="id" value={this.state.id}/>
                        <MDBInput label="Company Name" name="compNameValue" value={this.state.compNameValue} onChange={this.handleInputChange}/>
                        <MDBInput type="textarea" rows="2" label="Company Address" name="addressValue" value={this.state.addressValue} onChange={this.handleInputChange}/>
                        <MDBInput label="License Number" name="licenseValue" type="number" min="1" value={this.state.licenseValue} onChange={this.handleInputChange}/>
                        <MDBInput label="Owner Name"  name="ownerName" type="text" value={this.state.ownerName} onChange={this.handleInputChange}/>
                        <MDBInput label="Owner CNIC"  name="ownerCnic" type="tel" pattern="^\d{5}-\d{7}-\d{1}$" value={this.state.ownerCnic} onChange={this.handleInputChange}/>
                        <MDBInput type="textarea" rows="2" label="Owner Address" name="ownerAddress" value={this.state.ownerAddress} onChange={this.handleInputChange}/>
                        <MDBInput type="password" label="Password" name="password" value={this.state.password} onChange={this.handleInputChange}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" >Add</MDBBtn></center>
                    </form>
                </SlidingPane>

                {/* Add Distributor side pane */}
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
                    <NavItem>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </NavItem>
                    <NavItem>
                        <MDBBtn size="sm" color="primary" onClick={this.onAddUser} >Create User</MDBBtn>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Animation  type="fadeIn">
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={ this.state.users.manufacturers } version='4' hover condensed pagination options={ manufOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } >
                                        <TableHeaderColumn isKey dataField='id'>No.</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Company Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='address' filter={{ type: 'TextFilter', delay: 100 }}>Company Address</TableHeaderColumn>
                                    </BootstrapTable>
                                    <br/><br/>
                                </Col>
                            </Row>
                        </Animation>
                    </TabPane>
                    <TabPane tabId="2">
                        <Animation  type="fadeIn">
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={ this.state.users.distributors } version='4' hover condensed pagination options={ distOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } >
                                        <TableHeaderColumn isKey dataField='id'>No.</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Company Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='address' filter={{ type: 'TextFilter', delay: 100 }}>Company Owner</TableHeaderColumn>
                                    </BootstrapTable>
                                    <br/><br/>
                                </Col>
                            </Row>
                        </Animation>
                    </TabPane>
                    <TabPane tabId="3">
                        <Animation  type="fadeIn">
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={ this.state.users.chemists } version='4' hover condensed pagination options={ chemOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent }>
                                        <TableHeaderColumn isKey dataField='id'>No.</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Company Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='address' filter={{ type: 'TextFilter', delay: 100 }}>Company Owner</TableHeaderColumn>
                                    </BootstrapTable>
                                    <br/><br/>
                                </Col>
                            </Row>
                        </Animation>
                    </TabPane>
                </TabContent>
            </MDBContainer>
        );
    }
}

export default AdminPanel;
