import React, { Component } from 'react';
import { MDBIcon,  MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow } from "mdbreact";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import classnames from 'classnames';
import PanelHeading from "../components/PanelHeading";
import { Row, Col } from 'react-bootstrap'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import Select from 'react-select';
import QrReader from "react-qr-scanner";
import QRCode from 'qrcode.react'

class BSTable extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.isTransactionPaneOpen=false;
        this.state.transactions = [];
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
                                <MDBListGroup className="my-4 mx-4" style={{ width: "25rem" }}>
                                    <MDBListGroupItem color="primary">ID: {this.props.data.id}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">QRCode: {this.props.data.qr}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Description: {this.props.data.description}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Type: {this.props.data.type}</MDBListGroupItem>
                                </MDBListGroup>
                                <MDBListGroup className="my-4 mx-4" style={{ width: "25rem" }}>
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

class BSTableDist extends Component {
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
        this.state = {};
        this.state.activeTab = "1";
        this.state.isAssetPaneOpen = false;
        this.state.isDistributorPaneOpen = false;
        this.state.response = "";
        this.state.responseToPost = "";
        this.state.responseToPost2={};
        this.state.post = "";

        this.state.userID = "";

        this.state.distList=[];
        this.state.allDistList=[];
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
        this.state.user.distributors=[];
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
        this.state.distId = '0';
        this.state.distIdValid=false;
        this.state.dist = {};
        this.state.dist.address="";
        this.state.dist.assets=[];
        this.state.dist.chemists=[];
        this.state.dist.id="";
        this.state.dist.license="";
        this.state.dist.name="";
        this.state.dist.owneraddress="";
        this.state.dist.ownercnic="";
        this.state.dist.ownername="";
        this.state.dist.password="";
        /////////////////////////QR//////////////////////
        this.state.QrResultArray=[];
        this.state.qrbatch='';
        this.state.qrcarton='';
        this.state.qrnop='';
        this.state.qrqip='';
        this.state.distId2='0';
        this.state.distId2Valid=false;
        this.state.QrResult='';
        this.state.qrlist=[];
        this.state.totalPrice=0;
        /////////////////////////Bind Functions////////////////
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDistChange = this.handleDistChange.bind(this);

        this.toggle = this.toggle.bind(this);

        ////////////////////////////////////////////////////tab 4
        this.generateQRCode=this.generateQRCode.bind(this);
    }

    /////////////////////////////////////////tab4
    generateQRCode (props) {
        document.getElementById("qrdiv").style.display = "inline";
        var qstr = "GlaxoSmithKline-" + this.state.nameValue.label + "-" + this.state.qrbatch;
        if (this.state.qrcarton == 0) {
            this.state.qrlist.push(
                <div>
                    <QRCode value={qstr + "-0-0-0"} level="M" size="56" renderAs="svg" />
                    <br /><br />
                </div>
            )
            this.setState(this.state.qrlist);
        }
        else {
            for (var c = 0; c < this.state.qrcarton; c++) {
                if(this.state.qrnop==0){
                    this.state.qrlist.push(
                        <div>
                            <QRCode value={qstr +"-"+Number(c+1)+ "-0-0"} level="M" size="56" renderAs="svg" />
                            <br /><br />
                        </div>
                    )
                    this.setState(this.state.qrlist);
                }
                else{
                    for (var i = 0; i < this.state.qrnop; i++) {
                        if(this.state.qrqip==0){
                            this.state.qrlist.push(
                                <div>
                                    <QRCode value={qstr+"-"+Number(c+1)+"-"+Number(i+1)+ "-0"} level="M" size="56" renderAs="svg" />
                                    <br /><br />
                                </div>
                            )
                            this.setState(this.state.qrlist);
                        }
                        else{
                            for (var j = 0; j < this.state.qrqip; j++) {
                                this.state.qrlist.push(
                                    <div>
                                        <QRCode value={qstr + "-" + Number(c + 1) + "-" + Number(i + 1) + "-" + Number(j + 1)} level="M" size="56" renderAs="svg" />
                                        <br /><br />
                                    </div>
                                )
                                this.setState(this.state.qrlist);
                            }
                        }
                    }
                }
            }
        }
    }
    /////////////////////////////////////////tab4

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
        var distId=this.state.distId2;
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
                body: JSON.stringify({ post: assetId.concat('~',distId) })
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
            this.setState({distId2:'0', distId2Valid:false,QrResultArray:[]});
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

    handleDistChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState( { [name]: value } );
        if(value!=='0'){
            this.setState({distId2Valid: true});
        }else{
            this.setState({distId2Valid: false});
        }
    }

    handleAllDistChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState( { [name]: value } );
        if(value!=='0'){
            this.setState({distIdValid: true});
        }else{
            this.setState({distIdValid: false});
        }
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
            }else if(user.substring(0,4)==="chem"){
                this.redirectUser('/login/chem');
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
        this.callGetAllDist()
        .then(res => this.setState({ allDistList: res.express }))
        .catch(err => console.log(err));
    }

    callGetAllDist = async () => {
        const response = await fetch('/get_all_distributors');
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

        var distList=body.express.distributors.map( (distributor) => ({
            label: distributor.name+", "+distributor.address,
            value: distributor.id,
        }));

        this.setState({distList:distList});
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
            <BSTableDist data={ row }/>
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
            qtyValid:false,
        });
    };

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
                fieldErrors.expVal = value > this.state.manufacDate ? true : false;
                this.setState({ expValid:fieldErrors.expVal });
                break;
            case 'qtyValue':
                length = value.length > 0 ? true : false;
                fieldErrors.qtyVal = length && this.isPositiveInteger(value);
                this.setState({ qtyValid:fieldErrors.qtyVal });
                break;
            default:
                console.log("Invalid Feild");
        }

        this.setState({
            errors: fieldErrors,
            discValid:fieldErrors.discVal,
            priceValid:fieldErrors.priceVal,
            mgfValid:fieldErrors.mgfVal,
            expValid:fieldErrors.expVal,
            qtyValid:fieldErrors.qtyVal,
        }, this.validateAssetForm );
    }

    validateAssetForm() {
        this.setState({assetFormValid: this.state.nameValid && this.state.discValid && this.state.typeValid && this.state.priceValid && this.state.mgfValid && this.state.expValid && this.state.qtyValid });
    }

    handleAddAsset(id, qr, name, description, owner, type, price, mgfDate, expDate, qty, timestamp) {
        var asset = {
            index: (this.state.user.assets.length+1),
            description: description,
            expiryDate:expDate,
            id: id,
            manufactureDate: mgfDate,
            name: name,
            owner:owner,
            price: price,
            qr:qr,
            quantity: qty,
            timestamp: timestamp,
            type:type,
        }
        this.state.user.assets.push(asset);
        this.setState(this.state.user);
    };

    enrollDistributor = async e => {
        var distId=this.state.distId;
        var manufId=this.state.userID;
        e.preventDefault();

        const response = await fetch('/enroll_distributor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: manufId.concat('~',distId) })
        });
        const body = await response.json();
        if(body.express.status===1){
            this.getDist()
            .then(res => this.setState({ dist: res.express }))
            .catch(err => console.log(err));
            this.setState({distId:'0',distIdValid:false});
            document.getElementById("enrollmentFailure").style.display='none';
        }else{
            document.getElementById("enrollmentFailure").style.display='block';
            this.setState({distId:'0',distIdValid:false});
        }
    }

    getDist = async () => {
        var id = this.state.distId;
        const response = await fetch('/get_user/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if(body.express!==-1){
            var dist = {
                index: (this.state.user.distributors.length+1),
                address: body.express.address,
                id: body.express.id,
                license: body.express.license,
                name: body.express.name,
                owneraddress: body.express.owneraddress,
                ownercnic: body.express.ownercnic,
                ownername: body.express.ownername,
            }
            var tempDist={
                label: body.express.name+", "+body.express.address,
                value: body.express.id,
            }
            this.state.user.distributors.push(dist);
            this.state.distList.push(tempDist);
            this.setState(this.state.user);
            this.setState(this.state.distList);
        }
        return body;
    };

    handleSubmit = async e => {
        var id="asset"+(this.state.user.assets.length+1);
        var qr="abcdef";
        var name=this.state.nameValue.label;
        var description=this.state.discriptionValue;
        var owner=this.state.userID;
        var type=this.state.assetType.label;
        var price=this.state.priceValue;
        var mgfDate=this.state.manufacDate;
        var expDate=this.state.expiryDate;
        var qty=this.state.qtyValue;
        var timestamp=Date.now();
        this.closeAssetPanel();
        e.preventDefault();
        const response = await fetch('/add_asset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: id.concat('~',qr,'~',name,'~',description,'~',owner,'~',type,'~',price,'~',mgfDate,'~',expDate,'~',qty,'~',timestamp) })
        });
        const body = await response.json();
        this.setState({ responseToPost: body });
        if(body.express.status===1){
            this.handleAddAsset(id, qr, name, description, owner, type, price, mgfDate, expDate, qty, timestamp);
            document.getElementById("assetFailure").style.display='none';
        }else{
            document.getElementById("assetFailure").style.display='block';
        }
    };

    render() {
        const assetOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.user.assets.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        const distOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.user.distributors.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        const scanAssetOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.QrResultArray.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        return (
            <MDBContainer>
                <PanelHeading title="Manufacturer Panel"/>
                {/* Add asset side pane */}
                <SlidingPane closeIcon={<div>[ X ]</div>} isOpen={this.state.isAssetPaneOpen} title='Add Asset' from='right' width='400px' onRequestClose={this.closeAssetPanel}>
                    <form onSubmit={this.handleSubmit}>
                        <Select required className={this.state.nameValid ? "success" : "error"} placeholder="Asset Name *" value={this.state.nameValue} onChange={this.handleChange} options={assetNames}/>
                        <MDBInput required id={this.state.discValid ? "success" : "error"} type="textarea" label="Description" rows="2" name="discriptionValue" value={this.state.discriptionValue} onChange={this.handleInputChange}/>
                        <Select required className={this.state.typeValid ? "success" : "error"} placeholder="Asset Type *" value={this.state.assetType} onChange={this.handleTypeChange} options={assetTypes}/>
                        <MDBInput required id={this.state.priceValid ? "success" : "error"} label="Price *" name="priceValue" type="number" min="1" value={this.state.priceValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.mgfValid ? "success" : "error"} label="Manufacture Date *" hint="mm/dd/yyyy" name="manufacDate" type="date" value={this.state.manufacDate} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.expValid ? "success" : "error"} label="Expiry Date *" hint="mm/dd/yyyy" name="expiryDate" type="date" value={this.state.expiryDate} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.qtyValid ? "success" : "error"} label="Quantity *" name="qtyValue" type="number" min="1" value={this.state.qtyValue} onChange={this.handleInputChange}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" disabled={!this.state.assetFormValid}>Add</MDBBtn></center>
                    </form>
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
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '4' })} onClick={() => { this.toggle('4'); }}>QR Codes</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm={12}>
                                <label id="assetFailure" style={{color:"red", display:"none"}}>Cannot Create Asset.</label>
                                <MDBBtn size="sm" color="primary" onClick={()=>this.setState({ isAssetPaneOpen: true })} >Add Asset</MDBBtn>
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
                                <label id="enrollmentFailure" style={{color:"red", display:"none"}}>Cannot Enroll Distributor, selected distributor alredy enrolled.</label>
                                <form onSubmit={this.enrollDistributor} >
                                    <div className="form-group">
                                    <select required className={this.state.distIdValid ? "custom-select is-valid" : "custom-select is-invalid"} value={this.state.distId} onChange={this.handleAllDistChange} name="distId" >
                                        <option value = '0'>Distributor *</option>
                                        {this.state.allDistList.map(function(item, i){
                                            return <option key={i} value={item.value}>{item.label}</option>
                                         })}
                                    </select>
                                    </div>
                                    <MDBBtn size="sm" color="primary" type="submit" disabled={!this.state.distIdValid}>Enroll</MDBBtn>
                                </form>

                                <BootstrapTable data={ this.state.user.distributors } version='4' hover condensed pagination options={ distOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponentDist } >
                                    <TableHeaderColumn isKey dataField='index'>No.</TableHeaderColumn>
                                    <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Distributor Name</TableHeaderColumn>
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
                                    <select id="distTransact" required className={this.state.distId2Valid ? "custom-select is-valid" : "custom-select is-invalid"} value={this.state.distId2} onChange={this.handleDistChange} name="distId2" >
                                        <option value = '0'>Distributor *</option>
                                        {this.state.distList.map(function(item, i){
                                            return <option key={i} value={item.value}>{item.label}</option>
                                         })}
                                    </select>
                                    <MDBBtn color="blue"  size="sm" type="submit" disabled={!(this.state.distId2Valid && (this.state.QrResultArray.length > 0)) }>Transact</MDBBtn>

                                </Col>
                                <Col sm={3}>
                                    <h5>Scanner:</h5>
                                    <QrReader delay={500} onError={this.handleError} onScan={this.handleScan} style={{ width:"180px", border:"2px solid red" }} />
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
                                <Col md={10}>
                                </Col>
                                <Col md={2}>
                                    <label style={{ color: "green" }}>Total Price: {this.state.totalPrice}</label>
                                </Col>
                            </Row>
                        </form>
                    </TabPane>
                    <TabPane tabId="4">
                        <Row>
                            <Col sm={12}>
                                <center>
                                    <br/>
                                    <Select placeholder="Asset Name *" className="bMDBRowser-default" value={this.state.nameValue} onChange={this.handleChange} options={assetNames}/>
                                    <MDBInput required label="Batch" type="number" onChange={this.handleInputChange} name="qrbatch"/><br/>
                                    <MDBInput required label="Number of cartons" type="number" onChange={this.handleInputChange} name="qrcarton"/><br/>
                                    <MDBInput required label="Number of packs" type="number" onChange={this.handleInputChange} name="qrnop"/><br/>
                                    <MDBInput required label="Quantity in pack" type="number" onChange={this.handleInputChange} name="qrqip"/><br/>
                                    <MDBBtn label="Genetate Codes" onClick={this.generateQRCode} >Generate</MDBBtn>
                                    <br/>
                                    <div id="qrdiv" style={{display:"none"}}>
                                        <h2>Gernerated QR Codes</h2>
                                        {this.state.qrlist}
                                    </div>
                                </center>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </MDBContainer>
        );
    }
}

export default ManufacturerPanel;
