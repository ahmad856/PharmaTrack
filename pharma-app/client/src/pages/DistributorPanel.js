import React, { Component } from 'react';
import {MDBIcon, MDBContainer, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow } from "mdbreact";
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

    getUser = async () => {
        var id = null;
        if(sessionStorage.getItem("user")){
            id = sessionStorage.getItem("user");
        }
        const response = await fetch('/get_user/'+id);
        const body = await response.json();
        var chemList=body.express.chemists.map( (chemist) => ({
            label: chemist.name+", "+chemist.address,
            value: chemist.id,
        }));

        this.setState({chemList:chemList});
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
            document.getElementById("enrollmentFailure").style.display='none';
        }else{
            this.setState({chemId:'0',chemIdValid:false});
            document.getElementById("enrollmentFailure").style.display='block';
        }
    }

    getChem = async () => {
        var id = this.state.chemId;
        const response = await fetch('/get_user/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if(body.express!==-1){
            var chem = {
                index: (this.state.user.chemists.length+1),
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
            this.state.user.chemists.push(chem);
            this.state.chemList.push(tempChem);
            this.setState(this.state.user);
            this.setState(this.state.chemList);
        }
        return body;
    };

    render() {
        const assetOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.user.assets.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        const chemOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.user.chemists.length } ],
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
                        <Row>
                            <Col sm={12}>
                                <br/>
                                <label id="enrollmentFailure" style={{color:"red", display:"none"}}>Cannot Enroll Chemist, selected chemist alredy enrolled.</label>
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

                                <BootstrapTable data={ this.state.user.chemists } version='4' hover condensed pagination options={ chemOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponentDist } >
                                    <TableHeaderColumn isKey dataField='index'>No.</TableHeaderColumn>
                                    <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Chemist Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField='owneraddress' filter={{ type: 'TextFilter', delay: 100 }}>Owner</TableHeaderColumn>
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
                                    <MDBBtn color="blue"  size="sm" type="submit" disabled={!(this.state.chemId2Valid && (this.state.QrResultArray.length > 0))} >Transact</MDBBtn>

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
                                        <TableHeaderColumn dataField='name'>Asset Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField='price'>Price</TableHeaderColumn>
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
