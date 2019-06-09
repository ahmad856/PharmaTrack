import React, { Component } from 'react';
import { MDBIcon,  MDBContainer, MDBInput, MDBBtn, MDBCol, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow } from "mdbreact";
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

class BSTableProd extends Component {
    render() {
        if (this.props.data) {
            return (
                <MDBContainer>
                    <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                        <MDBCardHeader> Product Details</MDBCardHeader>
                        <MDBCardBody className="text-info">
                            <MDBRow className="justify-content-center">
                                <MDBListGroup className="my-4 mx-4" style={{ width: "25rem" }}>
                                    <MDBListGroupItem color="primary">ID : {this.props.data.id}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Type : {this.props.data.type}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">RetailPrice : {this.props.data.retailprice}</MDBListGroupItem>
                                </MDBListGroup>
                                <MDBListGroup className="my-4 mx-4" style={{ width: "25rem" }}>
                                    <MDBListGroupItem color="primary">Unit Quantity : {this.props.data.unitquantity}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Carton Capacity : {this.props.data.cartoncapacity}</MDBListGroupItem>
                                    <MDBListGroupItem color="primary">Packet Capacity : {this.props.data.packetcapacity}</MDBListGroupItem>
                                </MDBListGroup>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer>
            );
        } else {
            return (
                <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                    <MDBCardHeader>Product Details</MDBCardHeader>
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
        this.state.isBatchPaneOpen = false;
        this.state.isDistributorPaneOpen = false;
        this.state.response = "";
        this.state.responseToPost = "";
        this.state.responseToPost2={};
        this.state.post = "";

        this.state.userID = "";
        this.state.prodId = "";
        this.state.prodIdValid=false;
        this.state.prodList=[];
        this.state.distList=[];
        this.state.allDistList=[];
        ////////////////////////////PRODUCT////////////////////
        this.state.prodNameValue="";
        this.state.prodDiscValue="";
        this.state.assetType=null;
        this.state.priceValue="";
        this.state.unitQuantityValue="";
        this.state.cartonCapValue="";
        this.state.packetCapValue="";
        this.state.productFormErrors={nameVal:'', discVal:'', typeVal:'', priceVal:'', unitQtyVal:'', cartonCapVal:'', packetCapVal:''};
        this.state.productFormValid=false;
        this.state.prodNameValid=false;
        this.state.prodDiscValid=false;
        this.state.typeValid=false;
        this.state.priceValid=false;
        this.state.unitQuantityValid=false;
        this.state.cartonCapValid=false;
        this.state.packetCapValid=false;
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
        this.state.user.products=[];
        this.state.user.batchcount=0;
        this.state.user.email="";
        this.state.user.status="";
        /////////////////////////////UserProps/////////////////
        this.state.userProps = {};
        this.state.userProps.distributors=[];
        this.state.userProps.products=[];//asset
        this.state.userProps.pharmaassets=[];//asset
        /////////////////////////ASSET/////////////////////////

        this.state.manufacDate="";
        this.state.expiryDate="";
        this.state.qtyValue="";
        this.state.assetFormErrors={ mgfVal:'', expVal:'', qtyVal:'' };
        this.state.assetFormValid=false;
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

        /////////////////////Products

        ///////testTransaction
        this.state.testId="";
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
            window.location.reload();
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

        this.getAllProps()
        .then(res => this.setState({ userProps: res.express }))
        .catch(err => console.log(err));

        this.callGetAllDist()
        .then(res => this.setState({ allDistList: res.express }))
        .catch(err => console.log(err));
    }

    callGetAllDist = async () => {
        const response = await fetch('/get_all_distributors');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("alldist",body);
        return body;
    };

    getAllProps= async () =>{
        var id = null;
        if(sessionStorage.getItem("user")){
            id = sessionStorage.getItem("user");
        }
        const response = await fetch('/get_manufacturer_props/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        var prodList=body.express.products.map( (product) => ({
            label: product.name+", "+product.description,
            value: product.id,
        }));
        this.setState({prodList:prodList});

        var distList=body.express.distributors.map( (distributor) => ({
            label: distributor.name+", "+distributor.address,
            value: distributor.id,
        }));
        this.setState({distList:distList});
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
        console.log("user",body);
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

    expandComponentProd(row) {
        return (
            <BSTableProd data={ row }/>
        );
    }

    expandComponentDist(row) {
        return (
            <BSTableDist data={ row }/>
        );
    }

    closeProductPanel = () => {
        this.setState({
            isProductPaneOpen: false,
            prodNameValue:"",
            prodDiscValue:"",
            assetType:null,
            priceValue:"",
            unitQuantityValue:"",
            cartonCapValue:"",
            packetCapValue:"",
            productFormErrors:{nameVal:'', discVal:'', typeVal:'', priceVal:'', unitQtyVal:'', cartonCapVal:'', packetCapVal:''},
            productFormValid:false,
            prodNameValid:false,
            prodDiscValid:false,
            typeValid:false,
            priceValid:false,
            unitQuantityValid:false,
            cartonCapValid:false,
            packetCapValid:false,
        })
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
        var fieldErrors=this.state.assetFormErrors;
        var prodFieldErrors=this.state.productFormErrors;
        var length=null;
        switch(name){
            case 'prodNameValue':
                prodFieldErrors.nameVal = value.length > 0 ? true : false;
                this.setState({ prodNameValid:prodFieldErrors.nameVal });
                break;
            case 'prodDiscValue':
                prodFieldErrors.discVal = value.length > 10 ? true : false;
                this.setState({ prodDiscValid:prodFieldErrors.discVal });
                break;
            case 'priceValue':
                length = value.length > 0 ? true : false;
                prodFieldErrors.priceVal = length && this.isPositiveInteger(value);
                this.setState({ priceValid:prodFieldErrors.priceVal });
                break;
            case 'unitQuantityValue':
                length = value.length > 0 ? true : false;
                prodFieldErrors.unitQtyVal = length && this.isPositiveInteger(value);
                this.setState({ unitQuantityValid:prodFieldErrors.unitQtyVal });
                break;
            case 'cartonCapValue':
                length = value.length > 0 ? true : false;
                prodFieldErrors.cartonCapVal = length && this.isPositiveInteger(value);
                this.setState({ cartonCapValid:prodFieldErrors.cartonCapVal });
                break;
            case 'packetCapValue':
                length = value.length > 0 ? true : false;
                prodFieldErrors.packetCapVal = length && this.isPositiveInteger(value);
                this.setState({ packetCapValid:prodFieldErrors.packetCapVal });
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
            productFormErrors:prodFieldErrors,
            assetFormErrors: fieldErrors,
        }, this.validateForm );
    }

    validateForm() {
        this.setState({ productFormValid: this.state.prodNameValid && this.state.prodDiscValid && this.state.typeValid && this.state.priceValid && this.state.unitQuantityValid && this.state.cartonCapValid && this.state.packetCapValid});
        this.setState({assetFormValid: this.state.prodIdValid && this.state.mgfValid && this.state.expValid && this.state.qtyValid });
    }

    handleAddAsset(id, qr, name, description, owner, type, price, mgfDate, expDate, qty, timestamp) {
        var asset = {
            index: (this.state.userProps.pharmaassets.length+1),
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
        this.state.userProps.pharmaassets.push(asset);
        this.setState(this.state.userProps);
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
            document.getElementById("enrollmentSuccess").style.display='block';
        }else{
            document.getElementById("enrollmentFailure").style.display='block';
            document.getElementById("enrollmentSuccess").style.display='none';
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
                index: (this.state.userProps.distributors.length+1),
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

            this.state.userProps.distributors.push(dist);
            this.state.distList.push(tempDist);
            this.setState(this.state.userProps);
            this.setState(this.state.distList);
        }
        return body;
    };

    //updating Ahmad Shahid
    handleSubmit = async e => {
        var manufId = sessionStorage.getItem("user");
        var prodId=this.state.prodId;
        var mgfDate=this.state.manufacDate;
        var expDate=this.state.expiryDate;
        var qty=this.state.qtyValue;
        this.closeBatchPanel();
        e.preventDefault();
        const response = await fetch('/add_batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: manufId.concat('~',prodId,'~',mgfDate,'~',expDate,'~',qty) })
        });
        const body = await response.json();
        this.setState({ responseToPost: body });
        if(body.express.status===1){
            //this.handleAddAsset(id, name, description, owner, type, price, mgfDate, expDate, qty, timestamp);
            document.getElementById("assetFailure").style.display='none';
            document.getElementById("assetSuccess").style.display='block';
            window.location.reload();
        }else{
            document.getElementById("assetFailure").style.display='block';
            document.getElementById("assetSuccess").style.display='none';
        }
    };

    closeBatchPanel = () => {
        this.setState({
            isBatchPaneOpen: false,
            manufacDate:'',
            expiryDate:'',
            qtyValue:'',
            assetFormErrors:{mgfVal:'', expVal:'', qtyVal:''},
            assetFormValid:false,
            mgfValid:false,
            expValid:false,
            qtyValid:false,
            prodId : "",
            prodIdValid:false,
        });
    };
    // updating Ahmad Shahid

    onAddBatch=()=>{
        this.setState({ isBatchPaneOpen: true });
        this.getAllCounts()
        .then(res => this.setState({ count: res.express }))//get batch count
        .catch(err => console.log(err));
    }

    onAddProduct=()=>{
        this.setState({ isProductPaneOpen: true });
        this.getAllCounts()
        .then(res => this.setState({ count: res.express }))//get product count
        .catch(err => console.log(err));
    }

    handleProductSubmit = async e => {
        var manufId = sessionStorage.getItem("user");
        var id="prod"+this.state.count.productcount;
        var name=this.state.prodNameValue;
        var type=this.state.assetType.label;
        var description=this.state.prodDiscValue;
        var retailPrice=this.state.priceValue;
        var unitQty=this.state.unitQuantityValue;
        var cartonCap=this.state.cartonCapValue;
        var packetCap=this.state.packetCapValue;
        this.closeProductPanel();
        e.preventDefault();
        const response = await fetch('/add_product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: manufId.concat('~',name,'~',type,'~',description,'~',retailPrice,'~',unitQty,'~',cartonCap,'~',packetCap) })
        });
        const body = await response.json();
        this.setState({ responseToPost: body });
        if(body.express.status===1){
            this.handleAddProduct(manufId, id, name, type, description, retailPrice, unitQty, cartonCap, packetCap);
            document.getElementById("productFailure").style.display='none';
            document.getElementById("productSuccess").style.display='block';
        }else{
            document.getElementById("productFailure").style.display='block';
            document.getElementById("productSuccess").style.display='none';
        }
    }

    handleAddProduct(manufId, id, name, type, description, retailPrice, unitQty, cartonCap, packetCap){
        var product={
            index:(this.state.userProps.products.length+1),
            manufId:manufId,
            id:id,
            name:name,
            type:type,
            description:description,
            retailprice:retailPrice,
            unitquantity:unitQty,
            cartoncapacity:cartonCap,
            packetcapacity:packetCap,
        }
        this.state.userProps.products.push(product);
        this.setState(this.state.userProps);
        var tempProd={
            label: name+", "+description,
            value: id,
        }

        this.state.prodList.push(tempProd);
        this.setState(this.state.prodList);
    }

    handleAllProdChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState( { [name]: value } );
        if(value!=='0'){
            this.setState({prodIdValid: true});
        }else{
            this.setState({prodIdValid: false});
        }
    }

    testTransaction=async e=>{
        var id = null;
        if(sessionStorage.getItem("user")){
            id = sessionStorage.getItem("user");
        }
        var distId=this.state.distId2;
        var body=null;
        var error=false;
        e.preventDefault();
        var assetId=this.state.testId;
        const response = await fetch('/change_owner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: id.concat('~',assetId,'~',distId) })
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

    getAllCounts = async () => {
        const response = await fetch('/get_statics');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log(body);
        return body;
    };
    // updating Ahmad Shahid

    qrFormatter(cell, row){

        return (<QRCode value={ cell } level="M" size="56" renderAs="svg" />);
    };

    render() {
        const assetOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.userProps.pharmaassets.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        const productOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.userProps.products.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        const distOptions = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.userProps.distributors.length } ],
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
                {/* updating Ahmad Shahid */}
                {/* Add batch side pane */}
                <SlidingPane closeIcon={<div>[ X ]</div>} isOpen={this.state.isBatchPaneOpen} title='Add Batch' from='right' width='400px' onRequestClose={this.closeBatchPanel}>
                    <form onSubmit={this.handleSubmit}>
                        <select required className={this.state.prodIdValid ? "custom-select is-valid" : "custom-select is-invalid"} value={this.state.prodId} onChange={this.handleAllProdChange} name="prodId" >
                            <option value = '0'>Product *</option>
                            {this.state.prodList.map(function(item, i){
                                return <option key={i} value={item.value}>{item.label}</option>
                             })}
                        </select>
                        <MDBInput required id={this.state.mgfValid ? "success" : "error"} label="Manufacture Date *" hint="mm/dd/yyyy" name="manufacDate" type="date" value={this.state.manufacDate} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.expValid ? "success" : "error"} label="Expiry Date *" hint="mm/dd/yyyy" name="expiryDate" type="date" value={this.state.expiryDate} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.qtyValid ? "success" : "error"} label="Carton Quantity *" name="qtyValue" type="number" min="1" value={this.state.qtyValue} onChange={this.handleInputChange}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" disabled={!this.state.assetFormValid}>Add</MDBBtn></center>
                    </form>
                </SlidingPane>

                {/* Add product side pane */}
                <SlidingPane closeIcon={<div>[ X ]</div>} isOpen={this.state.isProductPaneOpen} title='Add Product' from='right' width='400px' onRequestClose={this.closeProductPanel}>
                    <form onSubmit={this.handleProductSubmit}>
                        <MDBInput required id={this.state.prodNameValid ? "success" : "error"} label="Product Name *" name="prodNameValue" type="text" value={this.state.prodNameValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.prodDiscValid ? "success" : "error"} type="textarea" label="Description" rows="1" name="prodDiscValue" value={this.state.prodDiscValue} onChange={this.handleInputChange}/>
                        <Select required className={this.state.typeValid ? "success" : "error"} placeholder="Asset Type *" value={this.state.assetType} onChange={this.handleTypeChange} options={assetTypes}/>
                        <MDBInput required id={this.state.priceValid ? "success" : "error"} label="Price *" name="priceValue" type="number" min="1" value={this.state.priceValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.unitQuantityValid ? "success" : "error"} label="Unit Quantity *" name="unitQuantityValue" type="number" min="1" value={this.state.unitQuantityValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.cartonCapValid ? "success" : "error"} label="Carton Capacity *" name="cartonCapValue" type="number" min="1" value={this.state.cartonCapValue} onChange={this.handleInputChange}/>
                        <MDBInput required id={this.state.packetCapValid ? "success" : "error"} label="Packet Capacity *" name="packetCapValue" type="number" min="1" value={this.state.packetCapValue} onChange={this.handleInputChange}/>
                        <center><MDBBtn size="sm" color="primary" type="submit" disabled={!this.state.productFormValid}>Add</MDBBtn></center>
                    </form>
                </SlidingPane>

                {/* updating Ahmad Shahid */}

                <Nav tabs pills>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>Assets</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>Distributors</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>Transactions</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '4' })} onClick={() => { this.toggle('4'); }}>Products</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '5' })} onClick={() => { this.toggle('5'); }}>QR Codes</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm={12}>
                                {/* updating Ahmad Shahid */}
                                <label id="assetFailure" style={{color:"red", display:"none"}}>Cannot Create Batch.</label>
                                <label id="assetSuccess" style={{color:"green", display:"none"}}>Batch Created.</label>
                                <MDBBtn size="sm" color="primary" onClick={this.onAddBatch} >Add Batch</MDBBtn>
                                <BootstrapTable data={ this.state.userProps.pharmaassets } version='4' hover condensed pagination options={ assetOptions }  expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } >
                                    <TableHeaderColumn isKey dataField='index' width='70' >No.</TableHeaderColumn>
                                    <TableHeaderColumn dataField='id' width='70' dataFormat={this.qrFormatter.bind(this)}>QR Code</TableHeaderColumn>
                                    <TableHeaderColumn dataField='id'>Asset ID</TableHeaderColumn>
                                    <TableHeaderColumn dataField='owner' filter={{ type: 'TextFilter', delay: 100 }}>Owner</TableHeaderColumn>
                                </BootstrapTable>
                                <br/><br/>
                                {/* updating Ahmad Shahid */}
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm={12}>
                                <br/>
                                <label id="enrollmentFailure" style={{color:"red", display:"none"}}>Cannot Enroll Distributor, selected distributor already enrolled.</label>
                                <label id="enrollmentSuccess" style={{color:"green", display:"none"}}>Distributor Enrolled Successfully!!!</label>
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

                                <BootstrapTable data={ this.state.userProps.distributors } version='4' hover condensed pagination options={ distOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponentDist } >
                                    <TableHeaderColumn isKey dataField='index' width='70' >No.</TableHeaderColumn>
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
                                    <MDBInput label="Product Id *" name="testId" type="text" value={this.state.testId} onChange={this.handleInputChange}/>
                                    <MDBBtn color="blue" size="sm" onClick={this.testTransaction}>Transact (Text Input)</MDBBtn>

                                    <MDBBtn color="blue" size="sm" type="submit" disabled={!(this.state.distId2Valid && (this.state.QrResultArray.length > 0)) }>Transact (QR Code)</MDBBtn>

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
                                        <TableHeaderColumn isKey dataField='index' width='70'>#</TableHeaderColumn>
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
                    <TabPane tabId="4">
                        <Row>
                            <Col sm={12}>
                                {/* updating Ahmad Shahid */}
                                <label id="productFailure" style={{color:"red", display:"none"}}>Cannot Create Product.</label>
                                <label id="productSuccess" style={{color:"green", display:"none"}}>Product created successfully.</label>
                                <MDBBtn size="sm" color="primary" onClick={this.onAddProduct} >Create Product</MDBBtn>
                                <BootstrapTable data={ this.state.userProps.products } version='4' hover condensed pagination options={ productOptions } expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponentProd }  >
                                    <TableHeaderColumn isKey dataField='index' width='70' >No.</TableHeaderColumn>
                                    <TableHeaderColumn dataField='name' filter={{ type: 'TextFilter', delay: 100 }}>Product Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField='description'>Product Description</TableHeaderColumn>
                                </BootstrapTable>
                                <br/><br/>
                                {/* updating Ahmad Shahid */}
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="5">
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
