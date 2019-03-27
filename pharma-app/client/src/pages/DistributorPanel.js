import React, { Component } from 'react';
import { MDBContainer, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle, MDBInput, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow } from "mdbreact";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import classnames from 'classnames';
import PanelHeading from "../components/PanelHeading";
import { Row, Col } from 'react-bootstrap'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
//import update from 'react-addons-update';
import Select from 'react-select';

class BSTable extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.isTransactionPaneOpen=false;
        this.state.distID="";
        this.state.responseToPost="";
        this.state.transactions = [];
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

    test=()=>{
        this.props.onChangeOwner(1,"ahmad");
    }

    closeTransactionPanel = () => {
        this.setState({ isTransactionPaneOpen: false });
    };

    openTransactionPanel = () => {
        this.setState({ isTransactionPaneOpen: true });
        this.getAllTransactions()
        .then(res => this.setState({ transactions: res.express }))
        .catch(err => console.log(err));
    };

    getAllTransactions = async () => {
        var id=this.props.data.Id;
        const response = await fetch('/get_asset_history/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    tranactionSubmit = async e => {
        var assetId=this.props.data.Id;
        var distId=this.state.distID;
        e.preventDefault();
        const response = await fetch('/change_owner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: assetId.concat('~',distId) })
        });

        const body = await response.text();
        this.setState({ responseToPost: body });
    };


    render() {
        if (this.props.data) {
            return (
                <MDBContainer>
                    {/* Show Transactions side pane */}
                    <MDBBtn size="sm" color="primary" onClick={this.test}>Test</MDBBtn>
                    <SlidingPane isOpen={this.state.isTransactionPaneOpen} title='Transactions History' closeIcon={<div>[ X ]</div>} from='left' width='400px' onRequestClose={this.closeTransactionPanel}>

                            {/* Iterates */}
                            {this.state.transactions.map(function(transaction){
                                return(
                                    <MDBCard border="info" className="m-3" style={{ width: "20rem" }} key={ transaction.txid }>
                                        <MDBCardHeader> Transaction Details</MDBCardHeader>
                                        <MDBCardBody className="text-info">
                                            <MDBRow className="justify-content-center">
                                                <MDBListGroup className="my-4 mx-4" style={{ width: "18rem" }}>
                                                    <MDBListGroupItem color="primary">ID: {transaction.txid}</MDBListGroupItem>
                                                    <MDBListGroupItem color="primary">Asset ID: {transaction.asset.id}</MDBListGroupItem>
                                                    <MDBListGroupItem color="primary">Asset Owner: {transaction.asset.owner}</MDBListGroupItem>
                                                </MDBListGroup>
                                            </MDBRow>
                                        </MDBCardBody>
                                    </MDBCard>
                                );
                            })}
                            {/* Iterates */}
                    </SlidingPane>

                    <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                        <MDBCardHeader> Asset Details</MDBCardHeader>
                        <MDBCardBody className="text-info">
                            <MDBRow className="justify-content-center">
                                <MDBListGroup className="my-4 mx-4" style={{ width: "20rem" }}>
                                    <MDBListGroupItem color="primary">ID: {this.props.data.Id}</MDBListGroupItem>
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
                            <MDBRow className="justify-content-center">
                                <MDBBtn size="sm" color="primary" onClick={this.openTransactionPanel}>Show Details</MDBBtn>

                                {/* <MDBBtn size="sm" color="primary">Transact Asset</MDBBtn> */}
                                <MDBDropdown dropup size="sm">
                                    <MDBDropdownToggle caret color="primary">Transact Asset</MDBDropdownToggle>
                                    <MDBDropdownMenu basic>
                                        <div>
                                            <form onSubmit={this.tranactionSubmit}>
                                                <MDBInput label="Distributor ID *" name="distID" type="text" value={this.state.distID} onChange={this.handleInputChange}/>
                                                <MDBBtn size="sm" color="primary" type="submit">Transact</MDBBtn>
                                            </form>
                                        </div>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBRow>
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

class DistributorPanel extends Component {
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
        this.state.nameValue=null;
        this.state.discriptionValue="";
        this.state.assetType=null;
        this.state.priceValue="";
        this.state.manufacDate="";
        this.state.expiryDate="";
        this.state.qtyValue="";
        this.state.assetFormErrors={nameVal:'', discVal:'', typeVal:'', priceVal:'', mgfVal:'', expVal:'', qtyVal:''};
        this.state.assetFormValid=false;
        this.state.nameValid=false;
        this.state.discValid=false;
        this.state.typeValid=false;
        this.state.priceValid=false;
        this.state.mgfValid=false;
        this.state.expValid=false;
        this.state.qtyValid=false;
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
        this.setState({ nameValue: selectedOption, nameValid: true });
    }

    handleTypeChange = (selectedOption) => {
        this.setState({ assetType: selectedOption, typeValid: true });
    }

    componentDidMount() {
        this.callGetAllAssets()
        .then(res => this.setState({ assets: this.flattenAssetData(res.express) }))
        .catch(err => console.log(err));
    }

    callGetAllAssets = async () => {
        const response = await fetch('/get_all_assets');
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

    // updateOwner(id,name){
    //     this.setState({
    //         assets: update(this.state.assets, {id: {Owner: {$set: name}}})
    //     })
    // }

    //() => this.setState({ isPaneOpenLeft: false })
    expandComponent(row) {
        //console.log(this.updateOwner);
        return (
            <BSTable data={ row }/>
        );
    }

    closeAssetPanel = () => {
        this.setState({
            isAssetPaneOpen: false,
            nameValue:null,
            discriptionValue:'',
            assetType:null,
            priceValue:'',
            manufacDate:'',
            expiryDate:'',
            qtyValue:'',
            assetFormErrors:{nameVal:'', discVal:'', typeVal:'', priceVal:'', mgfVal:'', expVal:'', qtyVal:''},
            assetFormValid:false,
            nameValid:false,
            discValid:false,
            typeValid:false,
            priceValid:false,
            mgfValid:false,
            expValid:false,
            qtyValid:false
        });
    };

    closeDistributorPanel = () => {
        this.setState({
            isDistributorPaneOpen: false,
            distNameValue:'',
            distOwnerValue:'',
            distAddressValue:'',
            // errors:{nameVal:'',priceVal:'',typeVal:'',qtyVal:''},
            // nameValid:false,
            // priceValid:false,
            // qtyValid:false,
            // typeValid:false,
            // formValid:false
        });
    };

//id, qr, name, description, owner, type, price, mgfDate, expDate, qty, timestamp
    flattenAssetData (assets_array) {
        var temp_asset=[];
        for(let i=0;i<assets_array.length;i++){
            var temp={};
            temp['#'] = i+1;
            temp['Id'] = assets_array[i].Record.id;
            temp['QRCode'] = assets_array[i].Record.qr;
            temp['Name'] = assets_array[i].Record.name;
            temp['Description'] = assets_array[i].Record.description;
            temp['Owner'] = assets_array[i].Record.owner;
            temp['AssetType'] = assets_array[i].Record.type;
            temp['Price'] = assets_array[i].Record.price;
            temp['ManufactureDate'] = assets_array[i].Record.manufactureDate;
            temp['ExpiryDate'] = assets_array[i].Record.expiryDate;
            temp['Quantity'] = assets_array[i].Record.quantity;
            temp['Timestamp'] = assets_array[i].Record.timestamp;
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
        },()=>{this.validate(name,value)});
    };

    //disabled={!this.state.formValid}

    isPositiveInteger(n) {
        return parseFloat(n) === n >>> 0;
    }

    validate(name,value){
        var fieldErrors=this.state.assetFormErrors;
        var length=null;
        switch(name){
            case 'discriptionValue':
                fieldErrors.discVal = value.length > 10 ? true : false;
                this.setState({ discValid:fieldErrors.discVal });
                break;
            case 'priceValue':
                length = value.length > 0 ? true : false;
                fieldErrors.priceVal = length && this.isPositiveInteger(value);
                this.setState({ priceValid:fieldErrors.priceVal });
                break;
            case 'manufacDate':
                fieldErrors.mgfVal = value.length > 0 ? true : false;
                this.setState({ mgfValid:fieldErrors.mgfVal });
                break;
            case 'expiryDate':
                fieldErrors.expVal = value.length > 0 ? true : false;
                this.setState({ expValid:fieldErrors.expVal });
                break;
            case 'qtyValue':
                length = value.length > 0 ? true : false;
                fieldErrors.qtyVal = length && this.isPositiveInteger(value);
                this.setState({ qtyValid:fieldErrors.qtyVal });
                break;
        }

        this.setState({
            errors: fieldErrors,
            discValid:fieldErrors.discVal,
            priceValid:fieldErrors.priceVal,
            mgfValid:fieldErrors.mgfVal,
            expValid:fieldErrors.expVal,
            qtyValid:fieldErrors.qtyVal,
        }, this.validateAssetForm());
    }

    validateAssetForm() {
        console.log("validate asset form");
        this.setState({assetFormValid: this.state.nameValid && this.state.discValid && this.state.typeValid && this.state.priceValid && this.state.mgfValid && this.state.expValid && this.state.qtyValid });
    }

    handleAddAsset(id, qr, name, description, owner, type, price, mgfDate, expDate, qty, timestamp) {
        var asset = {
            '#': (this.state.assets.length+1),
            'ID': id,
            'QRCode':qr,
            'Name': name,
            'Description': description,
            'Owner':owner,
            'AssetType':type,
            'Price': price,
            'ManufactureDate': mgfDate,
            'ExpiryDate':expDate,
            'Quantity': qty,
            'Timestamp': timestamp,
        }
        this.state.assets.push(asset);
        this.setState(this.state.assets);
    };

    //tasks.map((task) => task.name )

    handleSubmit = async e => {
        var id=""+(this.state.assets.length+1);
        var qr="abcdef";
        var name=this.state.nameValue.label;
        var description=this.state.discriptionValue;
        /////////////////////////////////////////change owner as login
        var owner="manuf1";
        var type=this.state.assetType.label;
        var price=this.state.priceValue;
        var mgfDate=this.state.manufacDate;
        var expDate=this.state.expiryDate;
        var qty=this.state.qtyValue;
        var timestamp=Date.now();
        this.handleAddAsset(id, qr, name, description, owner, type, price, mgfDate, expDate, qty, timestamp);
        this.closeAssetPanel();
        e.preventDefault();
        const response = await fetch('/add_asset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: id.concat('~',qr,'~',name,'~',description,'~',owner,'~',type,'~',price,'~',mgfDate,'~',expDate,'~',qty,'~',timestamp) })
        });
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
        const response = await fetch('/add_distributor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //body: JSON.stringify({ post: name.concat('~',price,'~',type,'~',qty) })
        });
        const body = await response.text();
        this.setState({ responseToPost: body });
    };

    //height='240' scrollTop={ 'Top' }

    // this.setState({
    //     items: update(this.state.items, {1: {name: {$set: 'updated field name'}}})
    // })

    render() {
        const options = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.assets.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        return (
            <MDBContainer>
                <PanelHeading title="Distributor Panel"/>
                {/* Add asset side pane */}
                <SlidingPane closeIcon={<div>[ X ]</div>} isOpen={this.state.isAssetPaneOpen} title='Add Asset' from='right' width='400px' onRequestClose={this.closeAssetPanel}>
                    <form onSubmit={this.handleSubmit}>
                        <Select placeholder="Asset Name *" className="bMDBRowser-default" required value={this.state.nameValue} onChange={this.handleChange} options={assetNames}/>
                        <MDBInput type="textarea" label="Description" rows="2" name="discriptionValue" value={this.state.discriptionValue} onChange={this.handleInputChange}/>
                        <Select placeholder="Asset Type *" value={this.state.assetType} onChange={this.handleTypeChange} options={assetTypes}/>
                        <MDBInput label="Price *" name="priceValue" type="number" min="1" value={this.state.priceValue} onChange={this.handleInputChange}/>
                        <MDBInput label="Manufacture Date *" hint="mm/dd/yyyy" name="manufacDate" type="date" value={this.state.manufacDate} onChange={this.handleInputChange}/>
                        <MDBInput label="Expiry Date *" hint="mm/dd/yyyy" name="expiryDate" type="date" value={this.state.expiryDate} onChange={this.handleInputChange}/>
                        <MDBInput label="Quantity *" name="qtyValue" type="number" min="1" value={this.state.qtyValue} onChange={this.handleInputChange}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" disabled={!this.state.assetFormValid} >Add</MDBBtn></center>
                    </form>
                </SlidingPane>

                {/* Add Distributor side pane */}
                <SlidingPane isOpen={this.state.isDistributorPaneOpen} title='Add Distributor' closeIcon={<div>[ X ]</div>} from='right' width='400px' onRequestClose={this.closeDistributorPanel}>
                    <form onSubmit={this.handleDistributorSubmit}>
                        <MDBInput label="Name *" name="distNameValue" type="text" value={this.state.distNameValue} onChange={this.handleInputChange}/>
                        <MDBInput label="Owner Name *" name="distOwnerValue" type="text" value={this.state.distOwnerValue} onChange={this.handleInputChange}/>
                        <MDBInput label="Address *" name="distAddressValue" type="text" value={this.state.distAddressValue} onChange={this.handleInputChange}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" >Add</MDBBtn></center>
                    </form>
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

                                <BootstrapTable data={ this.state.assets } version='4' hover condensed pagination options={ options }  expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } >
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
                </TabContent>

            </MDBContainer>
        );
    }
}

export default DistributorPanel;
