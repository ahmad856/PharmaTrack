import React, { Component } from 'react';
import {MDBIcon, MDBInput, MDBContainer, MDBBtn, MDBCard, MDBCol, MDBJumbotron, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from "mdbreact";
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
        this.modal= false;
        this.state.emailname="";
        this.state.emailtext="";
        this.state.emaildate="";

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


    sendSoldEmail = async() =>{
        const msg = 'I bought this asset with ID: '+this.state.code+' but it is recorded with some other customer.';
        this.setState({
            emailtext: msg
        });
        this.togglemodal();
    }
    sendUnsoldEmail = async() =>{
        const msg = 'I bought this asset with ID: '+this.state.code+' but it is still recorded as unsold.';
        this.setState({
            emailtext: msg
        });
        this.togglemodal();
    }

    sendEmail = async () => {
        
        this.togglemodal();

        const response = await fetch('/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
                body: JSON.stringify({ post: 'Name: '+this.state.emailname+'\nMessage: '+this.state.emailtext+'\nDate Bought: '+this.state.emaildate })
        });
        
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log(body);
        return body;
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


    togglemodal = () => {

        this.setState({
            modal: !this.state.modal,
        });
    }


    // <p>_____OR_____</p>
    render() {
        var custEx='empty';
        return (
            <MDBContainer>

                    <MDBModal isOpen={this.state.modal} toggle={this.togglemodal} size="lg">
                        <MDBModalHeader toggle={this.togglemodal}>Report Problem</MDBModalHeader>
                        <MDBModalBody>

                            <MDBInput label="Name" name="emailname" type="text" class="message-input" value={this.state.emailname} onChange={this.handleInputChange}/>
                            <MDBInput label="Complaint/Comments" name="emailtext" type="text" value={this.state.emailtext} onChange={this.handleInputChange}/>
                            <MDBInput label="When did you buy this asset?" hint="mm/dd/yyyy" name="emaildate" type="date" value={this.state.emaildate} onChange={this.handleInputChange}/>


                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={this.sendEmail}>Send</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>


                <MDBRow>
                    <MDBCol md="8" className="mx-auto">
                        <MDBJumbotron className="mt-3">
                            <label id="addError" style={{display:"none", color:"red"}}>Error: Could Not find asset. Please Scan again!!!</label>
                            <h1>Product Verification</h1>
                            <br />
                            <form>
                                <center><label className="fixTitle1">Scan Code :</label>
                                    <QrReader delay={500} onError={this.handleError} onScan={this.handleScan} style={{ width: "50%" }} />
                                    <MDBBtn size="sm" color="primary" onClick={this.verify}>Verify (QR Code)</MDBBtn>
                                </center>
                            </form>

                            <MDBInput label="Product Id *" name="code" type="text" value={this.state.code} onChange={this.handleInputChange}/>
                            <MDBBtn color="blue" size="sm" onClick={this.verify}>Verify (Text Input)</MDBBtn>
                        </MDBJumbotron>
                    </MDBCol>
                </MDBRow>

                {/* Iterates */}
                {this.state.transactions.map((transaction) => {
                    console.log(custEx);
                    if (transaction.asset.customer.name) {
                        custEx= 'true';
                        return (
                            <MDBCard border="info" className="m-3" style={{ width: "70rem" }}>
                                <MDBCardHeader color="blue">
                                    <p><MDBIcon icon="user" /> Customer Details</p>
                                </MDBCardHeader>
                                <MDBCardBody>
                                    <label>This asset was </label>&nbsp;<label style={{ color: "red" }}> SOLD </label>&nbsp;<label> to a customer </label><br /><br />
                                    <strong>Name: </strong>&nbsp;&nbsp;<label>{transaction.asset.customer.name}</label><br/>
                                    <strong>Phone: </strong>&nbsp;&nbsp;<label>{transaction.asset.customer.phone}</label><br/>
                                    <strong>Date and Time: </strong>&nbsp;&nbsp;<label>{Date(transaction.asset.customer.timestamp).toString()}</label><br />
                                    <br/>
                                    <label>Not you? </label>&nbsp;
                                    <MDBBtn size="sm" color="red" onClick={this.sendSoldEmail}>Report Here!</MDBBtn>

                                </MDBCardBody>
                            </MDBCard>
                        );
                    }
                    else {
                        custEx= 'false';
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
                {
                    custEx == 'false' ? (
                            <MDBCard border="info" className="m-3" style={{ width: "70rem" }}>
                                <MDBCardHeader color="red">
                                    <p><MDBIcon icon="user" /> Customer Details</p>
                                </MDBCardHeader>
                                <MDBCardBody>
                                    <label>This asset is </label>&nbsp;<label style={{ color: "red" }}> NOT SOLD </label>&nbsp;<label> to any customer yet </label><br /><br />
                                    <br />
                                    <br />
                                    <label>Bought it? </label>&nbsp;
                                    <MDBBtn size="sm" color="red" onClick={this.sendUnsoldEmail}>Report Here!</MDBBtn>

                                </MDBCardBody>
                            </MDBCard>
                    ) : (console.log("else"))
                    
                }
            </MDBContainer>
        );
    }
}

export default Verification;
