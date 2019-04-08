import React, { Component } from 'react';
import {MDBInput, MDBIcon, MDBContainer, MDBRow, MDBCol, MDBJumbotron, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBListGroupItem, MDBListGroup } from "mdbreact";
import QrReader from "react-qr-reader";

//<img src={qrImg} alt="QR Code" height="50px" width="50px"/>
class Verification extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.code="";
        this.state.transactions = [];
        this.state.custExArr=[];
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleScan = this.handleScan.bind(this);
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
                this.redirectUser('/login/chem');
            }
        }
    }

    handleScan(data) {
        if (data) {
            this.setState({code: data});
            this.verify();
        }
    }

    handleError(err) {
        console.error(err);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    verify = () => {
        this.getAllTransactions()
        .then()
        .catch(err => console.log(err));
    };

    getAllTransactions = async () => {
        var id=this.state.code;
        console.log(id);
        const response = await fetch('/get_asset_history/'+id);
        const body = await response.json();
        if(body.express===null){
            this.setState({ transactions: [] });
            console.log("asset doesnot exist");
            document.getElementById("addError").style.display = 'block';
        }else{
            this.setState({ transactions: body.express });
            document.getElementById("addError").style.display = 'none';
        }
        if (response.status !== 200) throw Error(body.message);
        return body;
    };
    // <p>_____OR_____</p>
    render() {
        var custEx='false';
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="8" className="mx-auto">
                        <MDBJumbotron className="mt-3">
                            <label id="addError" style={{display:"none", color:"red"}}>Error: Could Not find asset. Please Scan again!!!</label>
                            <h1>Product Verification</h1>
                            <br />
                            <form>
                                <center><label class="fixTitle1">Scan Code :</label>
                                    <QrReader delay={500} onError={this.handleError} onScan={this.handleScan} style={{ width: "50%" }} />
                                    <MDBBtn size="sm" color="primary" onClick={this.verify}>Verify</MDBBtn>
                                </center>
                            </form>
                        </MDBJumbotron>
                    </MDBCol>
                </MDBRow>

                {/* Iterates */}
                {this.state.transactions.map(function (transaction) {
                    console.log(custEx);
                    if (transaction.asset.customer.name) {
                        return (
                            <MDBCard border="info" className="m-3" style={{ width: "70rem" }}>
                                <MDBCardHeader color="blue">
                                    <p><MDBIcon icon="user" /> Customer Details</p>
                                </MDBCardHeader>
                                <MDBCardBody>
                                    <label>This asset was </label>&nbsp;<label style={{ color: "red" }}> SOLD </label>&nbsp;<label> to a customer </label><br /><br />
                                    <strong>Name: </strong>&nbsp;&nbsp;<label>{transaction.asset.customer.name}</label><br />
                                    <strong>Phone: </strong>&nbsp;&nbsp;<label>{transaction.asset.customer.phone}</label><br />
                                    <strong>Date and Time: </strong>&nbsp;&nbsp;<label>{Date(transaction.asset.customer.timestamp).toString()}</label><br />
                                    <br />
                                    <label>Not you? </label>&nbsp;<a href="#">Report here!</a><br />
                                </MDBCardBody>
                            </MDBCard>
                        );
                    }
                    else {
                        return (
                            <MDBCard border="info" className="m-3" style={{ width: "70rem" }} key={transaction.txid}>
                                <MDBCardHeader> Transaction Details</MDBCardHeader>
                                <MDBCardBody className="text-info">
                                    <MDBRow className="justify-content-center">
                                        <MDBListGroup className="my-4 mx-4" style={{ width: "66rem" }}>
                                            <MDBListGroupItem color="primary">Asset Name: {transaction.asset.name}</MDBListGroupItem>
                                            <MDBListGroupItem color="primary">Asset ID: {transaction.asset.id}</MDBListGroupItem>
                                            <MDBListGroupItem color="primary">Asset Owner: {transaction.asset.owner}</MDBListGroupItem>
                                        </MDBListGroup>
                                    </MDBRow>
                                </MDBCardBody>
                            </MDBCard>
                        );
                    }
                })}
                {this.state.custExArr.map(function (fun) {
                    if (custEx == 'false') {
                        return (
                            <MDBCard border="info" className="m-3" style={{ width: "70rem" }}>
                                <MDBCardHeader color="red">
                                    <p><MDBIcon icon="user" /> Customer Details</p>
                                </MDBCardHeader>
                                <MDBCardBody>
                                    <label>This asset is </label>&nbsp;<label style={{ color: "red" }}> NOT SOLD </label>&nbsp;<label> to any customer yet </label><br /><br />
                                    <br />
                                    <br />
                                    <label>Bought it? </label>&nbsp;<a href="#">Report here!</a><br />
                                </MDBCardBody>
                            </MDBCard>
                        );
                    }
                    else{
                        console.log("lpc");
                    }
                })}
            </MDBContainer>
        );
    }
}

export default Verification;
