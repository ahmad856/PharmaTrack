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
    constructor(props) {
        super(props);
        this.state={};
        this.state.isTransactionPaneOpen=false;
        this.state.distID="";
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
    //,()=>{this.validate(name,value)}


    closeTransactionPanel = () => {
        this.setState({ isTransactionPaneOpen: false });
    };

    render() {
        if (this.props.data) {
            return (
                <MDBContainer>
                {/* Show Transactions side pane */}
                <SlidingPane closeIcon={<div>[ X ]</div>} isOpen={ this.state.isTransactionPaneOpen } title='Transactions'
                from='left' width='400px' onRequestClose={ this.closeTransactionPanel }>
                    <div>

                    </div>
                </SlidingPane>

                <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                    <MDBCardHeader> Asset Details</MDBCardHeader>
                    <MDBCardBody className="text-info">
                        <MDBRow className="justify-content-center">
                            <MDBListGroup className="my-4 mx-4" style={{ width: "20rem" }}>
                                <MDBListGroupItem color="primary">ID: {this.props.data.ID}</MDBListGroupItem>
                                <MDBListGroupItem color="primary">QRCode: {this.props.data.QRCode}</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Description: {this.props.data.Description}</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Type: {this.props.data.AssetType}</MDBListGroupItem>
                            </MDBListGroup>
                            <MDBListGroup className="my-4 mx-4" style={{ width: "20rem" }}>
                                <MDBListGroupItem color="primary">Mfg Date: {this.props.data.ManufactureDate}</MDBListGroupItem>
                                <MDBListGroupItem color="primary">ExpiryDate: {this.props.data.ExpiryDate}</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Timestamp: {this.props.data.Timestamp}</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Price: {this.props.data.Price}</MDBListGroupItem>
                            </MDBListGroup>
                        </MDBRow>
                        <center>
                            <MDBBtn size="sm" color="primary" onClick={()=>this.setState({ isTransactionPaneOpen: true })}>Show Details</MDBBtn>
                            {/* <MDBBtn size="sm" color="primary">Transact Asset</MDBBtn> */}
                            <MDBDropdown>
                                <MDBDropdownToggle caret>
                                    Transact Asset
                                </MDBDropdownToggle>
                                <MDBDropdownMenu className="dropdown-default" right>
                                    <form>
                                        <MDBInput label="Distributor ID *" name="distID" type="text" value={this.state.distID} onChange={this.handleInputChange}/>
                                        <MDBBtn size="sm">Transact</MDBBtn>
                                    </form>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </center>
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

///////////////////////////////ASSET//////////////////////
// ID string `json:"id"`
// QRCode string `json:"qr"`
// Name string `json:"name"` done
// Description string `json:"description"` done
// AssetType string `json:"type"` done
// Price float32 `json:"price"` done
// ManufactureDate string `json:"manufactureDate" done`
// ExpiryDate string `json:"expiryDate"` done
// Quantity int `json:"quantity"` done
// Timestamp uint64 `json:"timestamp"` done
// Owner  string `json:"owner"`  done

///////////////////////////////Distributor///////////////////
// ID string `json:"id"`
// Name string `json:"name"`
// Owner string 'json:"owner"'
// Address  string `json:"address"`
// Timestamp uint64 `json:"timestamp"`

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
    { label: "Medical Gloves", value: 17 },
    { label: "Obstetrical Forceps", value: 18 },
    { label: "Surgical Mask", value: 19 },
    { label: "Gowns", value: 20 },
    { label: "Head Covering", value: 21 },
    { label: "Shoe Covering", value: 22 },
];

class ManufacturerPanel extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.activeTab="1";
        this.state.isAssetPaneOpen=false;
        this.state.isDistributorPaneOpen=false;
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
        ////////////////////////Distributor////////////////////
        this.state.distNameValue="";
        this.state.distOwnerValue="";
        this.state.distAddressValue="";

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
        this.setState({ nameValue: selectedOption });
        console.log(`Option selected:`, selectedOption);
    }

    handleTypeChange = (selectedOption) => {
        this.setState({ assetType: selectedOption });
        console.log(`Option selected:`, selectedOption);
    }

    componentDidMount() {
        this.callGetAllMedicines()
        .then(res => this.setState({ assets: this.flattenAssetData(res.express) }))
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

    closeAssetPanel = () => {
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

    closeDistributorPanel = () => {
        this.setState({
            isDistributorPaneOpen: false,
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

    flattenAssetData (assets_array) {
        var temp_asset=[];
        for(let i=0;i<assets_array.length;i++){
            var temp={};
            temp['#'] = i+1;
            temp['ID'] = assets_array[i].Record.id;
            temp['QRCode'] = assets_array[i].Record.qr;
            temp['Name'] = assets_array[i].Record.name;
            temp['Description'] = assets_array[i].Record.description;
            temp['AssetType'] = assets_array[i].Record.type;
            temp['Price'] = assets_array[i].Record.price;
            temp['ManufactureDate'] = assets_array[i].Record.manufactureDate;
            temp['ExpiryDate'] = assets_array[i].Record.expiryDate;
            temp['Quantity'] = assets_array[i].Record.quantity;
            temp['Timestamp'] = assets_array[i].Record.timestamp;
            temp['Owner'] = assets_array[i].Record.owner;
            temp_asset.push(temp);
        }
        return temp_asset;
    }
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

    handleAddAsset(id, qr, name, description, type, price, mgfDate, expDate, qty, owner, timestamp) {
        var asset = {
            '#': (this.state.assets.length+1),
            'ID': id,
            'QRCode':qr,
            'Name': name,
            'Description': description,
            'AssetType':type,
            'Price': price,
            'ManufactureDate': mgfDate,
            'ExpiryDate':expDate,
            'Quantity': qty,
            'Timestamp': owner,
            'Owner':timestamp,
        }
        alert(asset);
        this.state.assets.push(asset);
        this.setState(this.state.assets);
    };

    //tasks.map((task) => task.name )
    handleSubmit = async e => {
        var id="asset"+(this.state.assets.length+1);
        var qr="abcdef";
        var name=this.state.nameValue.label;
        var description=this.state.discriptionValue;
        var owner=this.state.ownerValue;
        var type=this.state.typeValue.label;
        var price=this.state.priceValue;
        var mgfDate=this.state.manufacDate;
        var expDate=this.state.expiryDate;
        var qty=this.state.qtyValue;
        var timestamp=Date.now();
        this.handleAddAsset(id, qr, name, description, type, price, mgfDate, expDate, qty, owner, timestamp);
        this.closeAssetPanel();
        e.preventDefault();
        const response = await fetch('/add_medicine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: id.concat('-',qr,'-',name,'-',description,'-',owner,'-',type,'-',price,'-',mgfDate,'-',expDate,'-',qty,'-',timestamp) })
        });
        console.log("Assets");
        console.log(this.state.assets);
        console.log(response.text());
        const body = await response.text();
        this.setState({ responseToPost: body });
    };

    handleAddDistributor(name,address) {
        var distributor = {
            Name: name,
            Address: address
        }
        this.state.distributors.push(distributor);
        this.setState(this.state.distributors);
    };

    handleDistributorSubmit = async e => {
        this.handleAddDistributor(this.state.distNameValue, this.state.distAddressValue);
        var name=this.state.distNameValue;
        var address=this.state.distAddressValue;
        this.closeAssetPanel();
        e.preventDefault();
        const response = await fetch('/add_medicine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //body: JSON.stringify({ post: name.concat('-',price,'-',type,'-',qty) })
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
                {/* Add asset side pane */}
                <SlidingPane closeIcon={<div>[ X ]</div>} isOpen={ this.state.isAssetPaneOpen } title='Add Asset'
                from='right' width='400px' onRequestClose={ this.closeAssetPanel }>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <Select placeholder="Asset Name *" value={this.state.nameValue} onChange={this.handleChange} options={assetNames}/>
                            <MDBInput type="textarea" label="Description" rows="2" name="discriptionValue" value={this.state.discriptionValue} onChange={this.handleInputChange}/>
                            <Select placeholder="Asset Type *" value={this.state.assetType} onChange={this.handleTypeChange} options={assetTypes}/>
                            <MDBInput label="Price *" name="priceValue" type="number" min="1" value={this.state.priceValue} onChange={this.handleInputChange}/>
                            <MDBInput label="Manufacture Date *" hint="mm/dd/yyyy" name="manufacDate" type="date" value={this.state.manufacDate} onChange={this.handleInputChange}/>
                            <MDBInput label="Expiry Date *" hint="mm/dd/yyyy" name="expiryDate" type="date" value={this.state.expiryDate} onChange={this.handleInputChange}/>
                            <MDBInput label="Quantity *" name="qtyValue" type="number" min="1" value={this.state.qtyValue} onChange={this.handleInputChange}/>
                            <MDBInput label="Owner Name *" name="ownerValue" type="text" value={this.state.ownerValue} onChange={this.handleInputChange}/>
                            <center><MDBBtn size="sm" color="primary" type="submit" >Add</MDBBtn></center>
                        </form>
                    </div>
                </SlidingPane>

                {/* Add Distributor side pane */}
                <SlidingPane closeIcon={<div>[ X ]</div>} isOpen={ this.state.isDistributorPaneOpen } title='Add Distributor'
                from='right' width='400px' onRequestClose={ this.closeDistributorPanel }>
                    <div>
                        <form onSubmit={this.handleDistributorSubmit}>
                            <MDBInput label="Name *" name="distNameValue" type="text" value={this.state.distNameValue} onChange={this.handleInputChange}/>
                            <MDBInput label="Owner Name *" name="distOwnerValue" type="text" value={this.state.distOwnerValue} onChange={this.handleInputChange}/>
                            <MDBInput label="Address *" name="distAddressValue" type="text" value={this.state.distAddressValue} onChange={this.handleInputChange}/>
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
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm={12}>
                                <MDBBtn size="sm" color="primary" onClick={()=>this.setState({ isAssetPaneOpen: true })} >Add Asset</MDBBtn>

                                <BootstrapTable data={ this.state.assets } version='4' hover condensed pagination options={ options }>
                                    <TableHeaderColumn isKey dataField='#'>No.</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Name' filter={{ type: 'TextFilter', delay: 100 }}>Asset Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Owner' filter={{ type: 'TextFilter', delay: 100 }}>Owner</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Quantity' >Quantity</TableHeaderColumn>
                                </BootstrapTable>
                                <br/><br/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm={12}>
                            <MDBBtn size="sm" color="primary" onClick={()=>this.setState({ isDistributorPaneOpen: true })} >Add Distributor</MDBBtn>

                            <BootstrapTable data={ this.state.assets } version='4' hover condensed pagination expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } options={ options }>
                                <TableHeaderColumn isKey dataField='#'>No.</TableHeaderColumn>
                                <TableHeaderColumn dataField='Name' filter={{ type: 'TextFilter', delay: 100 }}>Asset Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='Owner' filter={{ type: 'TextFilter', delay: 100 }}>Owner</TableHeaderColumn>
                                <TableHeaderColumn dataField='Quantity' >Quantity</TableHeaderColumn>
                            </BootstrapTable>
                            <br/><br/>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>

            </MDBContainer>
        );
    }
}

export default ManufacturerPanel;
