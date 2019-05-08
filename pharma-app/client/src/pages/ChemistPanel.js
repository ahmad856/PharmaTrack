import React, { Component } from 'react';
import { MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow } from "mdbreact";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import classnames from 'classnames';
import PanelHeading from "../components/PanelHeading";
import { Row, Col } from 'react-bootstrap'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import QrReader from "react-qr-scanner";

class BSTable extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.isTransactionPaneOpen=false;
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
        var id=this.props.data.id;
        const response = await fetch('/get_asset_history/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    render() {
        if (this.props.data) {
            return (
                <MDBContainer>
                    {/* Show Transactions side pane */}

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
                                    <MDBListGroupItem color="primary">ID: {this.props.data.id}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">QRCode: {this.props.data.qr}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Description: {this.props.data.description}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Type: {this.props.data.type}</MDBListGroupItem>
                                </MDBListGroup>
                                <MDBListGroup className="my-4 mx-4" style={{ width: "20rem" }}>
                                    <MDBListGroupItem color="primary">Mfg Date: {this.props.data.manufactureDate}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">ExpiryDate: {this.props.data.expiryDate}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Timestamp: {this.props.data.timestamp}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Price: {this.props.data.price}</MDBListGroupItem>
                                </MDBListGroup>
                            </MDBRow>
                            <MDBRow className="justify-content-center">
                                <MDBBtn size="sm" color="primary" onClick={this.openTransactionPanel}>Show Details</MDBBtn>
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

class ChemistPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.activeTab = "1";
        this.state.isAssetPaneOpen = false;
        this.state.isChemistPaneOpen = false;
        this.state.response = "";
        this.state.responseToPost = "";
        this.state.responseToPost2 = {};
        this.state.post = "";
        this.state.userID = "";
        //////////////////////////////USER/////////////////////
        this.state.user = {};
        this.state.user.address="";
        this.state.user.id="";
        this.state.user.license="";
        this.state.user.name="";
        this.state.user.owneraddress="";
        this.state.user.ownercnic="";
        this.state.user.ownername="";
        this.state.user.password="";
        this.state.user.assets=[];

        ////////////////////////Chemist////////////////////
        this.state.customer = "";
        this.state.phone = "";
        this.state.transactionFormErrors={customerVal:'', phoneVal:''};
        this.state.transactionFormValid=false;
        this.state.customerValid=false;
        this.state.phoneValid=false;

        /////////////////////////QR//////////////////////
        this.state.QrResultArray=[];
        this.state.QrResult='';
        this.state.totalPrice=0;
        /////////////////////////Bind Functions////////////////
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleScan = (data) => {
        var found = false;
        if (data) {
            for (var i = 0; i < this.state.user.assets.length; i++) {
                if (data === this.state.user.assets[i].id) {
                    for (var k = 0; k < this.state.QrResultArray.length; k++) {
                        if (data === this.state.QrResultArray[k].id) {
                            document.getElementById("itemAlreadyExist").style.display = 'block';
                            document.getElementById("itemNotFound").style.display = 'none';
                            return;
                        }
                    }
                    found = true;
                    document.getElementById("itemAlreadyExist").style.display = 'none';
                    this.setState({ QrResult: data });
                    var temp = JSON.parse(JSON.stringify(this.state.user.assets[i]));
                    temp.index = this.state.QrResultArray.length + 1;
                    this.state.QrResultArray.push(temp);
                    this.setState(this.state.QrResultArray);
                    document.getElementById("itemNotFound").style.display = 'none';
                    this.setState({ totalPrice: this.state.totalPrice + temp.price });
                    return;
                }
            }
            if (!found) {
                document.getElementById("itemNotFound").style.display = 'block';
                document.getElementById("itemAlreadyExist").style.display = 'none';
            }
        }
    }

    transactionSubmitAll = async e => {
        var name=this.state.customer;
        var phone=this.state.phone;
        var timestamp = Date.now();
        var assetId=null;
        var error=false;
        e.preventDefault();
        for(var i=0;i<this.state.QrResultArray.length;i++){
            assetId=this.state.QrResultArray[i].id;
            const response = await fetch('/sell_asset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post: assetId.concat('~',name,'~',phone,'~',timestamp) })
            });

            const body = await response.json();
            if(body.express.status===-1){
                error = true;
                break;
            }
            this.setState({ responseToPost2: body });
        }
        if(error){
            document.getElementById("transactionFailure").style.display='block';
            document.getElementById("itemNotFound").style.display = 'none';
            document.getElementById("itemAlreadyExist").style.display = 'none';
        }else{
            this.setState({QrResultArray:[]});
            document.getElementById("transactionSuccess").style.display='block';
            document.getElementById("itemNotFound").style.display = 'none';
            document.getElementById("itemAlreadyExist").style.display = 'none';
        }
    };

    handleError=(err)=> {
        console.error(err);
    }

    handleChange = (selectedOption) => {
        this.setState({ nameValue: selectedOption, nameValid: true });
    }

    handleTypeChange = (selectedOption) => {
        this.setState({ assetType: selectedOption, typeValid: true });
    }

    redirectUser = (path) => {
        this.props.history.push(path);
    }

    componentDidMount() {
        var user = null;
        if(sessionStorage.getItem("user")){
            user = sessionStorage.getItem("user");
            if(user.substring(0,5)==="admin"){
                this.redirectUser('/login/admin');
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
        this.getUser()
        .then(res => this.setState({ user: res.express }))
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

    expandComponent(row) {
        return (
            <BSTable data={ row }/>
        );
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        },()=>{this.validate(name,value)});
    };

    isPositiveInteger(n) {
        return parseFloat(n) === n >>> 0;
    }

    validate(name,value){
        var fieldErrors=this.state.transactionFormErrors;
        switch(name){
            case 'customer':
                fieldErrors.customerVal = value.length > 10 ? true : false;
                this.setState({ customerValid:fieldErrors.customerVal });
                break;
            case 'phone':
                fieldErrors.phoneVal = /^(\+92) {0,1}\d{3} {0,1}\d{7}$|^\d{11}$|^\d{4} \d{7}$/.test(value) ? true : false;
                this.setState({ phoneValid:fieldErrors.phoneVal });
                break;
            default:
                console.log("Invalid Feild");
        }
        this.setState({
            transactionFormErrors: fieldErrors,
        }, this.validateTransactionForm );
    }

    validateTransactionForm() {
        this.setState({transactionFormValid: this.state.phoneValid && this.state.customerValid });
    }

    render() {
        const assetOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.user.assets.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        return (
            <MDBContainer>
                <PanelHeading title="Chemist Panel"/>
                <Nav tabs pills>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>Asset</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>Transaction</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm={12}>
                                <BootstrapTable data={ this.state.user.assets } version='4' hover condensed pagination options={ assetOptions }  expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } >
                                    <TableHeaderColumn isKey dataField='index'>No.</TableHeaderColumn>
                                    <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Asset Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField='owner' filter={{ type: 'TextFilter', delay: 100 }}>Owner</TableHeaderColumn>
                                    <TableHeaderColumn dataField='quantity' >Quantity</TableHeaderColumn>
                                </BootstrapTable>
                                <br/><br/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <form onSubmit={this.transactionSubmitAll}>
                            <Row>
                                <Col sm={6}>
                                    <MDBInput label="Customer Name" icon="user" name="customer" value={this.state.customer} onChange={this.handleInputChange} />
                                    <MDBInput label="Customer Phone Number" icon="phone" name="phone" value={this.state.phone} onChange={this.handleInputChange} />
                                    <MDBBtn color="blue"  size="sm" type="submit" disabled={!(this.state.transactionFormValid && (this.state.QrResultArray.length > 0))}>Transact</MDBBtn>
                                </Col>
                                <Col sm={3}>
                                    <h5>Scanner:</h5>
                                    <QrReader delay={500} onError={this.handleError} onScan={this.handleScan} style={{ width:"180px", border:"2px solid red" }} />
                                    <br/>
                                </Col>
                                <Col sm={3}>
                                    <br/><br/>
                                    <label style={{color:"green"}}>Scanned code:   {this.state.QrResult}</label>
                                    <label id="itemNotFound" style={{color:"red", display:"none"}}>Item not found</label>
                                    <label id="itemAlreadyExist" style={{color:"red", display:"none"}}>Item already scanned</label>
                                    <label id="transactionSuccess" style={{color:"green", display:"none"}}>Asset(s) Transacted Successfully</label>
                                    <label id="transactionFailure" style={{color:"red", display:"none"}}>Transaction Failed</label>
                                    <br/><br/>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={this.state.QrResultArray} version='4' hover>
                                        <TableHeaderColumn isKey dataField='index'>#</TableHeaderColumn>
                                        <TableHeaderColumn dataField='name'>Asset Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='price'>Price</TableHeaderColumn>
                                    </BootstrapTable>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={10}>
                                </Col>
                                <Col md={2}>
                                    <label style={{ color: "green" }}>Total Price: {this.state.totalPrice}</label>
                                </Col>
                            </Row>
                        </form>
                    </TabPane>
                </TabContent>
            </MDBContainer>
        );
    }
}

export default ChemistPanel;
