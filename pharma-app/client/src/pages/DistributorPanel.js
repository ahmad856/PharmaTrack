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
            document.getElementById("transactionFailure").style.display='block';
            document.getElementById("itemNotFound").style.display = 'none';
            document.getElementById("itemAlreadyExist").style.display = 'none';
        } else{
            this.setState({chemId2:'0',testId:"", chemId2Valid:false,QrResultArray:[]});
            document.getElementById("transactionSuccess").style.display='block';
            document.getElementById("itemNotFound").style.display = 'none';
            document.getElementById("itemAlreadyExist").style.display = 'none';
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

class BSTableChem extends Component {
    render() {
        if (this.props.data) {
            return (
                <MDBContainer>
                    <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                        <MDBCardHeader> User Details</MDBCardHeader>
                        <MDBCardBody className="text-info">
                            <MDBRow className="justify-content-center">
                                <MDBListGroup className="my-4 mx-4" style={{ width: "25rem",wordwrap: "break-word"  }}>
                                    <MDBListGroupItem color="primary">ID: {this.props.data.id}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Company Address: {this.props.data.address}</MDBListGroupItem>
                                </MDBListGroup>
                                <MDBListGroup className="my-4 mx-4" style={{ width: "25rem",wordwrap: "break-word" }}>
                                    <MDBListGroupItem color="primary">Owner Name: {this.props.data.ownername}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">License Number: {this.props.data.license}</MDBListGroupItem>
                                </MDBListGroup>
                            </MDBRow>
                        </MDBCardBody>
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

class DistributorPanel extends Component {
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

        this.state.chemList=[];
        this.state.allChemList=[];
        //////////////////////////////USER////////////////////
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
        this.state.user.chemists=[];

        /////////////////////////////UserProps/////////////////
        this.state.userProps = {};
        this.state.userProps.chemists=[];
        this.state.userProps.pharmaassets=[];//asset

        ////////////////////////Chemist////////////////////
        this.state.chemId = "";
        this.state.chemIdValid=false;
        this.state.chemId2 = "";
        this.state.chemId2Valid=false;

        this.state.chem = {};
        this.state.chem.address="";
        this.state.chem.assets=[];
        this.state.chem.chemists=[];
        this.state.chem.id="";
        this.state.chem.license="";
        this.state.chem.name="";
        this.state.chem.owneraddress="";
        this.state.chem.ownercnic="";
        this.state.chem.ownername="";
        this.state.chem.password="";
        /////////////////////////QR//////////////////////
        this.state.QrResultArray=[];
        this.state.qrbatch='';
        this.state.qrcarton='';
        this.state.qrnop='';
        this.state.qrqip='';
        this.state.QrResult='';
        this.state.qrlist=[];
        this.state.totalPrice=0;
        /////////////////////////Bind Functions////////////////
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleChemChange = this.handleChemChange.bind(this);

        ///////testTransaction
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

    transactionSubmitAll = async e => {
        var chemId=this.state.chemId2;
        var body=null;
        var error=false;
        e.preventDefault();
        for(var i=0;i<this.state.QrResultArray.length;i++){
            var assetId=this.state.QrResultArray[i].id;
            const response = await fetch('/change_owner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post: assetId.concat('~',chemId) })
            });

            body = await response.json();
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
        } else{
            this.setState({chemId2:'0', chemId2Valid:false, QrResultArray:[]});
            document.getElementById("transactionSuccess").style.display='block';
            document.getElementById("itemNotFound").style.display = 'none';
            document.getElementById("itemAlreadyExist").style.display = 'none';
        }
    };

    testTransaction=async e=>{
        var id = null;
        if(sessionStorage.getItem("user")){
            id = sessionStorage.getItem("user");
        }
        var chemId=this.state.chemId2;
        var body=null;
        var error=false;
        e.preventDefault();
        var assetId=this.state.testId;
        const response = await fetch('/change_owner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: id.concat('~',assetId,'~',chemId) })
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
            this.setState({chemId2:'0',testId:"", chemId2Valid:false,QrResultArray:[]});
            document.getElementById("transactionSuccess").style.display='block';
            document.getElementById("itemNotFound").style.display = 'none';
            document.getElementById("itemAlreadyExist").style.display = 'none';
            window.location.reload();
        }
    }


    handleError=(err)=> {
        console.error(err);
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
            }else if(user.substring(0,4)==="chem"){
                this.redirectUser('/login/chem');
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

        this.callGetAllChem()
        .then(res => this.setState({ allChemList: res.express }))
        .catch(err => console.log(err));
    }

    callGetAllChem = async () => {
        const response = await fetch('/get_all_chemists');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    getAllProps= async () =>{
        var id = null;
        if(sessionStorage.getItem("user")){
            id = sessionStorage.getItem("user");
        }
        const response = await fetch('/get_distributor_props/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        var chemList=body.express.chemists.map( (chemist) => ({
            label: chemist.name+", "+chemist.address,
            value: chemist.id,
        }));
        this.setState({chemList:chemList});
        console.log("allprops",body);
        return body;
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

    expandComponentDist(row) {
        return (
            <BSTableChem data={ row }/>
        );
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    handleChemChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState( { [name]: value } );
        if(value!=='0'){
            this.setState({chemId2Valid: true});
        }else{
            this.setState({chemId2Valid: false});
        }
    }

    handleAllChemChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState( { [name]: value } );
        if(value!=='0'){
            this.setState({chemIdValid: true});
        }else{
            this.setState({chemIdValid: false});
        }
    }

    enrollChemist = async e => {
        var chemId=this.state.chemId;
        var distId=this.state.userID;
        e.preventDefault();

        const response = await fetch('/enroll_chemist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: distId.concat('~',chemId) })
        });
        const body = await response.json();
        if(body.express.status===1){
            this.getChem()
            .then(res => this.setState({ chem: res.express }))
            .catch(err => console.log(err));
            this.setState({chemId:'0',chemIdValid:false});
            document.getElementById("enrollmentSuccess").style.display='block';
            document.getElementById("enrollmentFailure").style.display='none';
        }else{
            this.setState({chemId:'0',chemIdValid:false});
            document.getElementById("enrollmentFailure").style.display='block';
            document.getElementById("enrollmentSuccess").style.display='none';
        }
    }

    getChem = async () => {
        var id = this.state.chemId;
        const response = await fetch('/get_user/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if(body.express!==-1){
            var chem = {
                index: (this.state.userProps.chemists.length+1),
                address: body.express.address,
                id: body.express.id,
                license: body.express.license,
                name: body.express.name,
                owneraddress: body.express.owneraddress,
                ownercnic: body.express.ownercnic,
                ownername: body.express.ownername,
            }
            var tempChem={
                label: body.express.name+", "+body.express.address,
                value: body.express.id,
            }
            this.state.userProps.chemists.push(chem);
            this.state.chemList.push(tempChem);
            this.setState(this.state.userProps);
            this.setState(this.state.chemList);
        }
        return body;
    };

    qrFormatter(cell, row){

        return (<QRCode value={ cell } level="M" size="56" renderAs="svg" />);
    };

    render() {
        const assetOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.userProps.pharmaassets.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        const chemOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.userProps.chemists.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        const scanAssetOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.QrResultArray.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        return (
            <MDBContainer>
                <PanelHeading title="Distributor Panel"/>

                <Nav tabs pills>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>Asset</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>Chemist</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>Transaction</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm={12}>
                            {/*
                                <MDBBtn size="sm" color="primary" onClick={()=>this.setState({ isAssetPaneOpen: true })} >Add Asset</MDBBtn>
                            */}
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
                        <Row>
                            <Col sm={12}>
                                <br/>
                                <label id="enrollmentFailure" style={{color:"red", display:"none"}}>Cannot Enroll Chemist, selected chemist alredy enrolled.</label>
                                <label id="enrollmentSuccess" style={{color:"green", display:"none"}}>Successfully enrolled Chemist!!</label>
                                <form onSubmit={this.enrollChemist} >
                                    <div className="form-group">
                                        <select required className={this.state.chemIdValid ? "custom-select is-valid" : "custom-select is-invalid"} value={this.state.chemId} onChange={this.handleAllChemChange} name="chemId" >
                                            <option value = '0'>Chemist *</option>
                                            {this.state.allChemList.map(function(item, i){
                                                return <option key={i} value={item.value}>{item.label}</option>
                                             })}
                                        </select>
                                    </div>
                                    <MDBBtn size="sm" color="primary" type="submit" disabled={!this.state.chemIdValid}>Enroll</MDBBtn>
                                </form>

                                {/*
                                    <MDBBtn size="sm" color="primary" onClick={()=>this.setState({ isChemistPaneOpen: true })} >Add Chemist</MDBBtn>
                                */}

                                <BootstrapTable data={ this.state.userProps.chemists } version='4' hover condensed pagination options={ chemOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponentDist } >
                                    <TableHeaderColumn isKey dataField='index' width='70'>No.</TableHeaderColumn>
                                    <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Chemist Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField='owneraddress' filter={{ type: 'TextFilter', delay: 100 }}>Owner Address</TableHeaderColumn>
                                    <TableHeaderColumn dataField='ownercnic' >Owner CNIC</TableHeaderColumn>
                                </BootstrapTable>
                                <br/><br/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <form onSubmit={this.transactionSubmitAll}>
                            <Row>
                                <Col sm={6}>
                                    <br/>
                                    <MDBIcon far icon="user" />
                                    <select required className={this.state.chemId2Valid ? "custom-select is-valid" : "custom-select is-invalid"} value={this.state.chemId2} onChange={this.handleChemChange} name="chemId2" >
                                        <option value = '0'>Chemist *</option>
                                        {this.state.chemList.map(function(item, i){
                                            return <option key={i} value={item.value}>{item.label}</option>
                                         })}
                                    </select>
                                    <MDBInput label="Product Id *" name="testId" type="text" value={this.state.testId} onChange={this.handleInputChange}/>
                                    <MDBBtn color="blue" size="sm" onClick={this.testTransaction}>Transact (Text Input)</MDBBtn>

                                    <MDBBtn color="blue"  size="sm" type="submit" disabled={!(this.state.chemId2Valid && (this.state.QrResultArray.length > 0))} >Transact (QR Code)</MDBBtn>
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
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <BootstrapTable data={this.state.QrResultArray} version='4' hover condensed pagination options={ scanAssetOptions }>
                                        <TableHeaderColumn isKey dataField='index'>#</TableHeaderColumn>
                                        <TableHeaderColumn dataField='id'>Asset ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField='owner'>Owner</TableHeaderColumn>
                                    </BootstrapTable>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="10">
                                </Col>
                                <Col md="2">
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

export default DistributorPanel;
