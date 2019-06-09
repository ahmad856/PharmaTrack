import React, { Component } from 'react';
import {MDBIcon, MDBInput, MDBContainer, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from "mdbreact";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import classnames from 'classnames';
import PanelHeading from "../components/PanelHeading";
import { Row, Col } from 'react-bootstrap'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import QrReader from "react-qr-scanner";
import QRCode from 'qrcode.react'


class BSTable extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.isTransactionPaneOpen=false;
        this.state.transactions = [];
        this.modal= false;

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


    returnAsset=async e=>{
        var id = null;
        if(sessionStorage.getItem("user")){
            id = sessionStorage.getItem("user");
        }
        var body=null;
        var error=false;
        e.preventDefault();
        var assetId=this.props.data.id;

        //see if there are 6 months left in expiry (condition to return)

        var today = new Date();


        var parts =this.props.data.expiryDate.split('-');


        var expirydate = new Date(parts[0], parts[1] - 1, parts[2]);

        const diffTime = Math.abs(today.getTime() - expirydate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        

        if(today>=expirydate){
            this.togglemodal();
            return;
        }else if(diffDays<60){
            this.togglemodal();
            return;
        }


        const response = await fetch('/return_asset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: id.concat('~',assetId) })
        });

        body = await response.json();
        if(body.express.status===-1){
            error = true;
        }
        this.setState({ responseToPost2: body });
        if(error){
            document.getElementById("transactionFailure2").style.display='block';
            document.getElementById("itemNotFound2").style.display = 'none';
            document.getElementById("itemAlreadyExist2").style.display = 'none';
        } else{
            this.setState({chemId2:'0',testId:"", chemId2Valid:false,QrResultArray:[]});
            document.getElementById("transactionSuccess2").style.display='block';
            document.getElementById("itemNotFound2").style.display = 'none';
            document.getElementById("itemAlreadyExist2").style.display = 'none';
            window.location.reload();

        }
    }


    getAllTransactions = async () => {
        var id=this.props.data.id;
        const response = await fetch('/get_asset_history/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    togglemodal = () => {

        this.setState({
            modal: !this.state.modal,
        });
    }

    formatDate = () => {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    render() {
        if (this.props.data) {
            return (
                <MDBContainer>


                    <MDBModal isOpen={this.state.modal} toggle={this.togglemodal}>
                        <MDBModalHeader toggle={this.togglemodal}>Return Not Possible!</MDBModalHeader>
                        <MDBModalBody>
                        Item to be returned should have atleast 2 months (60 days) left in expiry.<br/>Today:&nbsp;{this.formatDate()}<br/>Expiry Date:&nbsp;{this.props.data.expiryDate}
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.togglemodal}>Close</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>


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
                                               

                                                {transaction.asset.customer.name.length>0 ? (
                                                    <div>
                                                    <MDBListGroupItem color="primary">Customer Name: {transaction.asset.customer.name}</MDBListGroupItem>
                                                    <MDBListGroupItem color="primary">Customer Phone: {transaction.asset.customer.phone}</MDBListGroupItem>
                                                    </div>
                                                    ) : (
                                                    <div>
                                                    <MDBListGroupItem color="primary">Owner ID: {transaction.asset.owner}</MDBListGroupItem>
                                                    <MDBListGroupItem color="primary">Owner Name: {transaction.asset.ownername}</MDBListGroupItem>
                                                    </div>
                                                )}


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
                                <MDBListGroup className="my-4 mx-4" style={{ width: "28rem" }}>
                                    <MDBListGroupItem color="primary">Owner Name: {this.props.data.ownername}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Product Id: {this.props.data.productid}</MDBListGroupItem>
                                </MDBListGroup>
                                <MDBListGroup className="my-4 mx-4" style={{ width: "28rem" }}>
                                    <MDBListGroupItem color="primary">Mfg Date: {this.props.data.manufactureDate}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">ExpiryDate: {this.props.data.expiryDate}</MDBListGroupItem>
                                </MDBListGroup>

                                <MDBListGroup className="my-4 mx-4" style={{ width: "28rem" }}>
                                    <MDBListGroupItem color="primary">
                                        <QRCode value={this.props.data.id.substring(0,10)+"000000000000000"} level="M" size="56" renderAs="svg" />
                                        &nbsp;&nbsp;<b>Batch ID:</b> {this.props.data.id.substring(0,10)+"000000000000000"}
                                    </MDBListGroupItem>
                                    <MDBListGroupItem color="primary">
                                        <QRCode value={this.props.data.id.substring(0,15)+"0000000000"} level="M" size="56" renderAs="svg" />
                                        &nbsp;&nbsp;<b>Carton ID:</b> {this.props.data.id.substring(0,15)+"0000000000"}
                                    </MDBListGroupItem>
                                    <MDBListGroupItem color="primary">
                                        <QRCode value={this.props.data.id.substring(0,20)+"00000"} level="M" size="56" renderAs="svg" />
                                        &nbsp;&nbsp;<b>Packet ID:</b> {this.props.data.id.substring(0,20)+"00000"}
                                    </MDBListGroupItem>
                                </MDBListGroup>


                            </MDBRow>
                            <MDBRow className="justify-content-center">
                                <MDBBtn size="sm" color="primary" onClick={this.openTransactionPanel}>Show History</MDBBtn>
                                <MDBBtn size="sm" color="primary" onClick={this.returnAsset}>Return</MDBBtn>
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
        /////////////////////////////UserProps/////////////////
        this.state.userProps = {};
        this.state.userProps.pharmaassets=[];//asset

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

        /////////////////////////QR Return//////////////////////
        this.state.QrResultArray2=[];
        this.state.QrResult2='';
        this.state.totalPrice2=0;

        /////////////////////////Bind Functions////////////////
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggle = this.toggle.bind(this);

        this.state.testId="";
    }

    handleScan = (data) => {
        var found = false;
        if (data) {
            for (var i = 0; i < this.state.userProps.pharmaassets.length; i++) {
                if (data === this.state.userProps.pharmaassets[i].id) {
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
                    var temp = JSON.parse(JSON.stringify(this.state.userProps.pharmaassets[i]));
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

    handleScan2 = (data) => {
        var found = false;
        if (data) {

            this.setState({ QrResult: data });

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

    returnSubmit = async e => {

        var userId='cust';
        var assetId=null;
        var error=false;
        e.preventDefault();

        assetId=this.state.QrResult2;
        const response = await fetch('/return_asset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: userId.concat('~',assetId) })
        });

        const body = await response.json();
        if(body.express.status===-1){
            error = true;
        }
        this.setState({ responseToPost2: body });
    
        if(error){
            document.getElementById("transactionFailure2").style.display='block';
            document.getElementById("itemNotFound2").style.display = 'none';
            document.getElementById("itemAlreadyExist2").style.display = 'none';
        }else{
            this.setState({QrResult2:""});
            document.getElementById("transactionSuccess2").style.display='block';
            document.getElementById("itemNotFound2").style.display = 'none';
            document.getElementById("itemAlreadyExist2").style.display = 'none';
            window.location.reload();

        }
    };


    testTransaction = async e =>{
        var id = null;
        if(sessionStorage.getItem("user")){
            id = sessionStorage.getItem("user");
        }
        var name=this.state.customer;
        var phone=this.state.phone;
        var timestamp = Date.now();
        var body=null;
        var error=false;
        e.preventDefault();
        var assetId=this.state.testId;
        const response = await fetch('/sell_asset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: id.concat('~',assetId,'~',name,'~',phone,'~',timestamp) })
        });

        body = await response.json();
        if(body.express.status===-1){
            error = true;
        }
        this.setState({ responseToPost2: body });
        if(error){
            document.getElementById("transactionFailure").style.display='block';
            document.getElementById("itemNotFound").style.display = 'none';
            document.getElementById("itemAlreadyExist").style.display = 'none';
        } else{
            this.setState({distId2:'0',testId:"", distId2Valid:false,QrResultArray:[]});
            document.getElementById("transactionSuccess").style.display='block';
            document.getElementById("itemNotFound").style.display = 'none';
            document.getElementById("itemAlreadyExist").style.display = 'none';
            window.location.reload();

        }
    }

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

        this.getAllProps()
        .then(res => this.setState({ userProps: res.express }))
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

    getAllProps= async () =>{
        var id = null;
        if(sessionStorage.getItem("user")){
            id = sessionStorage.getItem("user");
        }
        const response = await fetch('/get_chemist_props/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("allprops",body);
        return body;
    }

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

    qrFormatter(cell, row){

        return (<QRCode value={ cell } level="M" size="56" renderAs="svg" />);
    };

    render() {
        const assetOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.userProps.pharmaassets.length } ],
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
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>Customer Return</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm={12}>
                                <BootstrapTable data={ this.state.userProps.pharmaassets } version='4' hover condensed pagination options={ assetOptions }  expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } >
                                    <TableHeaderColumn isKey dataField='index' width='70'>No.</TableHeaderColumn>
                                    <TableHeaderColumn dataField='id' width='70' dataFormat={this.qrFormatter.bind(this)}>QR Code</TableHeaderColumn>
                                    <TableHeaderColumn dataField='id' >Asset ID</TableHeaderColumn>
                                    <TableHeaderColumn dataField='owner' filter={{ type: 'TextFilter', delay: 100 }}>Owner</TableHeaderColumn>
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

                                    <MDBInput label="Product Id *" name="testId" type="text" value={this.state.testId} onChange={this.handleInputChange}/>
                                    <MDBBtn color="blue" size="sm" onClick={this.testTransaction}>Transact (Text Input)</MDBBtn>

                                    <MDBBtn color="blue"  size="sm" type="submit" disabled={!(this.state.transactionFormValid && (this.state.QrResultArray.length > 0))}>Transact (QR Code)</MDBBtn>
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
                                        <TableHeaderColumn dataField='id'>Asset ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='owner'>Owner</TableHeaderColumn>
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
                    <TabPane tabId="3">
                        <form onSubmit={this.returnSubmit}>
                            <Row>
                                <Col sm={6}>
                                    <MDBInput label="Product Id *" name="QrResult2" type="text" value={this.state.QrResult2} onChange={this.handleInputChange}/>
                                    <MDBBtn color="blue" type="submit" size="sm">Return</MDBBtn>

                                </Col>
                                <Col sm={3}>
                                    <h5>Scanner:</h5>
                                    <QrReader delay={500} onError={this.handleError} onScan={this.handleScan2} style={{ width:"180px", border:"2px solid red" }} />
                                    <br/>
                                </Col>
                                <Col sm={3}>
                                    <br/><br/>
                                    <label style={{color:"green"}}>Scanned code:   {this.state.QrResult2}</label>
                                    <label id="itemNotFound2" style={{color:"red", display:"none"}}>Item not found</label>
                                    <label id="itemAlreadyExist2" style={{color:"red", display:"none"}}>Item already scanned</label>
                                    <label id="transactionSuccess2" style={{color:"green", display:"none"}}>Asset(s) Transacted Successfully</label>
                                    <label id="transactionFailure2" style={{color:"red", display:"none"}}>Transaction Failed</label>
                                    <br/><br/>
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
