import React, { Component } from 'react';
import { MDBContainer, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem, MDBInput, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow } from "mdbreact";
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
                    <MDBCardHeader> Asset Details</MDBCardHeader>
                    <MDBCardBody className="text-info">
                        <MDBRow className="justify-content-center">
                            <MDBListGroup className="my-4 mx-4" style={{ width: "20rem" }}>
                                <MDBListGroupItem color="primary">Description: Panadol Tablet</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Price: 45</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Timestamp: 1234343</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Type: Tablets</MDBListGroupItem>
                            </MDBListGroup>
                            <MDBListGroup className="my-4 mx-4" style={{ width: "20rem" }}>
                                <MDBListGroupItem color="primary">Salt: paracetamol</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Quantity: 3452</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Mfg Date: Jan. 1, 2018</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Expiry Date: Jan. 1, 2020</MDBListGroupItem>
                            </MDBListGroup>
                        </MDBRow>
                        <center><MDBBtn size="sm" color="primary">Show Details</MDBBtn></center>
                    </MDBCardBody>
                </MDBCard>
                </MDBContainer>
            );
        } else {
            return (
                <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                    <MDBCardHeader>Asset Details</MDBCardHeader>
                    <MDBCardBody className="text-info">
                        <center><MDBCardText>Details not found!!!</MDBCardText></center>
                    </MDBCardBody>
                </MDBCard>
            );
        }
    }
}

// QRCode string `json:"qr"`
// Name string `json:"name"`
// Description string `json:"description"`
// AssetType string `json:"type"`
// Price float32 `json:"price"`
// ManufactureDate string `json:"manufactureDate"`
// ExpiryDate string `json:"expiryDate"`
// Quantity int `json:"quantity"`
// Timestamp uint64 `json:"timestamp"`
// Owner  string `json:"owner"`
const assetTypes = [
    { label: "Medicine", value: 1 },
    { label: "Surgical Instrument", value: 2 },
    { label: "Hospital Equipment", value: 3 },
    { label: "Saftey Equipment", value: 4 },
];

const assetNames = [
    { label: "Panadol", value: 1 },
    { label: "Xyzal", value: 2 },
    { label: "Castine", value: 3 },
    { label: "Panadol Extra", value: 4 },
    { label: "Calpol", value: 5 },
    { label: "Brufen", value: 6 },
    { label: "Paracetamol", value: 7 },
    { label: "Castine", value: 8 },
    { label: "Forceps", value: 9 },
    { label: "Scissors", value: 10 },
    { label: "Speculums", value: 11 },
    { label: "Spatulas", value: 12 },
    { label: "Needle Holders", value: 13 },
    { label: "Nebulizers", value: 14 },
    { label: "Syringe", value: 15 },
    { label: "Catheter", value: 16 },
    { label: "Speculum", value: 17 },
    { label: "Medical Gloves", value: 18 },
    { label: "Obstetrical Forceps", value: 19 },
    { label: "Surgical Mask", value: 20 },
    { label: "Gowns", value: 21 },
    { label: "Head Covering", value: 22 },
    { label: "Shoe Covering", value: 23 },
];

class ManufacturerPanel extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.activeTab="1";
        this.state.isAssetPaneOpen=false;
        this.state.response="";
        this.state.responseToPost="";
        this.state.post="";
        this.state.assets = [];
        this.state.distributors = [];
        this.state.transactions = [];
        /////////////////////////ASSET/////////////////////////
        this.state.nameValue="";
        this.state.discriptionValue="";
        this.state.assetType=null;
        this.state.priceValue="";
        this.state.manufacDate="";
        this.state.expiryDate="";
        this.state.qtyValue="";
        this.state.ownerValue="";

        // this.state.errors={nameVal:'',priceVal:'',typeVal:'',qtyVal:''};
        // this.state.nameValid=false;
        // this.state.priceValid=false;
        // this.state.qtyValid=false;
        // this.state.typeValid=false;
        // this.state.formValid=false;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleChange = (selectedOption) => {
        this.setState({ assetType: selectedOption });
        console.log(`Option selected:`, selectedOption);
    }

    componentDidMount() {
        this.callGetAllMedicines()
        .then(res => this.setState({ assets: this.flattenData(res.express) }))
        .catch(err => console.log(err));
        console.log("Assets");
        console.log(this.state.assets);
    }

    callGetAllMedicines = async () => {
        const response = await fetch('/get_all_medicines');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log(body);
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

    closePanel = () => {
        this.setState({
            isAssetPaneOpen: false,
            nameValue:'',
            discriptionValue:'',
            assetType:'',
            priceValue:'',
            manufacDate:'',
            expiryDate:'',
            qtyValue:'',
            ownerValue:'',
            errors:{nameVal:'',priceVal:'',typeVal:'',qtyVal:''},
            nameValid:false,
            priceValid:false,
            qtyValid:false,
            typeValid:false,
            formValid:false
        });
    };
    /////////////////////////////////////////////////////////////
    flattenData (assets_array) {
        var temp_asset=[];
        for(let i=0;i<assets_array.length;i++){
            var temp={};
            temp['#'] = i+1;
            temp['Key'] = assets_array[i].Key;
            temp['Name'] = assets_array[i].Record.name;
            temp['Owner'] = assets_array[i].Record.owner;
            temp['TimeStamp'] = assets_array[i].Record.timestamp;
            temp_asset.push(temp);
        }
        return temp_asset;
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

    handleAddAsset(name,price,type,quantity) {
        var asset = {
            Key: name,
            name: price,
            owner: type,
            timestamp: quantity
        }
        this.state.assets.push(asset);
        this.setState(this.state.assets);
    };

    //tasks.map((task) => task.name )
    handleSubmit = async e => {
        this.handleAddAsset(this.state.nameValue,this.state.priceValue,this.state.typeValue,this.state.qtyValue);
        var name=this.state.nameValue;
        var price=this.state.priceValue;
        var type=this.state.typeValue;
        var qty=this.state.qtyValue;
        this.closePanel();
        e.preventDefault();
        const response = await fetch('/add_medicine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: name.concat('-',price,'-',type,'-',qty) })
        });
        console.log("Assets");
        console.log(this.state.assets);
        console.log(response.text());
        const body = await response.text();
        this.setState({ responseToPost: body });
    };

    //height='240' scrollTop={ 'Top' }

    render() {
        const options = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.assets.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        return (
            <MDBContainer>
                <PanelHeading title="Manufacturer Panel"/>

                <SlidingPane closeIcon={<div>[ X ]</div>} isOpen={ this.state.isAssetPaneOpen } title='Add Asset'
                from='right' width='400px' height='100px' onRequestClose={ this.closePanel }>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <Select placeholder="Asset Name *" value={this.state.nameValue} onChange={this.handleChange} options={assetNames}/>
                            <MDBInput type="textarea" label="Description" rows="2" name="discriptionValue" value={this.state.discriptionValue} onChange={this.handleInputChange}/>
                            <Select placeholder="Asset Type *" value={this.state.assetType} onChange={this.handleChange} options={assetTypes}/>
                            <MDBInput label="Price *" name="priceValue" type="number" min="1" value={this.state.priceValue} onChange={this.handleInputChange}/>
                            <MDBInput label="Manufacture Date *" hint="mm/dd/yyyy" name="manufacDate" type="date" value={this.state.manufacDate} onChange={this.handleInputChange}/>
                            <MDBInput label="Expiry Date *" hint="mm/dd/yyyy" name="expiryDate" type="date" value={this.state.expiryDate} onChange={this.handleInputChange}/>
                            <MDBInput label="Quantity *" name="qtyValue" type="number" min="1" value={this.state.qtyValue} onChange={this.handleInputChange}/>
                            <MDBInput label="Owner Name *" name="ownerValue" type="text" value={this.state.ownerValue} onChange={this.handleInputChange}/>
                            <center><MDBBtn size="sm" color="primary" type="submit" >Add</MDBBtn></center>
                        </form>
                    </div>
                </SlidingPane>

                <Nav tabs pills>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>Asset</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>Distributor</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>Transaction</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm={12}>
                                <MDBBtn size="sm" color="primary" onClick={()=>this.setState({ isAssetPaneOpen: true })} >Add Asset</MDBBtn>

                                <BootstrapTable data={ this.state.assets } version='4' hover condensed pagination expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } options={ options }>
                                    <TableHeaderColumn isKey dataField='#'>No.</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Name' filter={{ type: 'TextFilter', delay: 100 }}>Asset Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Type' filter={{ type: 'TextFilter', delay: 100 }}>Asset Type</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Price' filter={{ type: 'TextFilter', delay: 100 }}>Price</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Quantity' filter={{ type: 'TextFilter', delay: 100 }}>Quantity</TableHeaderColumn>
                                </BootstrapTable>
                                <br/><br/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm={12}>
                                <h4>Tab 2 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <Row>
                            <Col sm={12}>
                                <h4>Tab 3 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>

            </MDBContainer>
        );
    }
}

export default ManufacturerPanel;
