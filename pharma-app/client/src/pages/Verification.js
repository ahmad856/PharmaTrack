import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBJumbotron, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBListGroupItem, MDBListGroup, MDBInput } from "mdbreact";
import QrReader from "react-qr-reader";

//<img src={qrImg} alt="QR Code" height="50px" width="50px"/>
class Verification extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.state.code="";
        this.state.transactions = [];
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
        .then(res => this.setState({ transactions: res.express }))
        .catch(err => console.log(err));
    };

    getAllTransactions = async () => {
        var id=this.state.code;
        console.log(id);
        const response = await fetch('/get_asset_history/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };
    // <MDBInput label="Code *" name="code" type="number" value={this.state.code} onChange={this.handleInputChange}/>
    // <p>_____OR_____</p>
    render() {
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="8" className="mx-auto">
                        <MDBJumbotron className="mt-3">
                            <h1>Product Verification</h1>
                            <br/>
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
                {this.state.transactions.map(function(transaction){
                    return(
                        <MDBCard border="info" className="m-3" style={{ width: "70rem" }} key={ transaction.txid }>
                            <MDBCardHeader> Transaction Details</MDBCardHeader>
                            <MDBCardBody className="text-info">
                                <MDBRow className="justify-content-center">
                                    <MDBListGroup className="my-4 mx-4" style={{ width: "66rem" }}>
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
                <p>{this.state.result}</p>
            </MDBContainer>
        );
    }
}

export default Verification;
