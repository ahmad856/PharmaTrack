import React, { Component } from 'react';
import qrImg from '../images/qr.png';
//import tickImg from './images/tick.png';
//import alertImg from './images/alert.png';
//import crossImg from './images/cross.png';
import { MDBContainer, MDBRow, MDBCol, MDBJumbotron, MDBInput, MDBBtn } from "mdbreact";

//<img src={tickImg} height="50px" width="50px"/><br />
const OkModal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                <center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button class="modalCloseButton" onClick={handleClose}>[ X ]</button></center>
               <center>

                    <label class="custTitle">Status:</label><label class="custTitle2"> Verified</label><br /><br />
                    <label class="custTitle">Manufacturer:</label><label class="custTitle2"> GlaxoSmithKline</label><br /><br />
                    <label class="custTitle">Distributor:</label><label class="custTitle2"> Indus Distributor</label><br /><br />
                    <label class="custTitle">Chemist:</label><label class="custTitle2"> Al-fatah Medical Store</label><br /><br />
                    <label class="custTitle">Customer:</label><label class="custTitle2"> Muhammad Ali | 0300 11 11 111 </label><br /><br />
                </center>
                <br/><br/>
            </section>
        </div>
    );
};

//<img src={alertImg} height="50px" width="50px"/><br />
const NotOkModal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                <center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button class="modalCloseButton" onClick={handleClose}>[ X ]</button></center>
                <center>
                    <label class="custTitle">Status:</label><label class="custTitle2"> Customer Already Exist</label><br /><br />
                    <label class="custTitle">Manufacturer:</label><label class="custTitle2"> Abbot</label><br /><br />
                    <label class="custTitle">Distributor:</label><label class="custTitle2"> Kareem Distributor</label><br /><br />
                    <label class="custTitle">Chemist:</label><label class="custTitle2"> Clinix Medical Store</label><br /><br />
                    <label class="custTitle">Customer:</label><label class="custTitle2"> Furqan Ali | 0300 11 11 111 </label><br /><br />
                    <a href="#">  <label style={{color:"red"}}>Not You? Report</label></a>
                </center>
                <br/><br/>
            </section>
        </div>
    );
};

//<img src={crossImg} height="50px" width="50px"/><br />
const TryAgainModal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                <center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button class="modalCloseButton" onClick={handleClose}>[ X ]</button></center>
                <center>

                    <label style={{color:"red", fontSize:"30px"}}>Invalid Code!</label><br /><br /><br />
                    <label>Please try again</label>
                    <br /><br />

                </center>
            </section>
        </div>
    );
};


//<img src={qrImg} alt="QR Code" height="50px" width="50px"/>
class Verification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show1: false,
            show2: false,
            show3: false,
            code:''
        };
    }

    verifyProduct = () =>{
        if (Number(this.state.code)===12345){
             this.showModal1();
        }
        else if (Number(this.state.code) === 54321){
            this.showModal2();
        }
        else{
            this.showModal3();
        }
    }
    showModal1 = () =>{
        this.setState({ show1: true });
    }
    hideModal1 = () => {
        this.setState({ show1: false, code:''});
    };

    showModal2 = () =>{
        this.setState({ show2: true });
    }
    hideModal2 = () => {
        this.setState({ show2: false, code:''});
    };
    showModal3 = () =>{
        this.setState({ show3: true });
    }
    hideModal3 = () => {
        this.setState({ show3: false,code:''});
    };

    handleSubmit = event => {
        alert("MDBInput value: " + this.state.code);
        event.preventDefault();
    }

    handleChange = event => this.setState({ code: event.target.value });

    render() {
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="8" className="mx-auto">
                        <MDBJumbotron className="mt-3">
                            <h1>Product Verification</h1>
                            <br/><br/>
                            <form>
                                <center>
                                    <MDBCol md={4}>
                                        <MDBInput label="QR Code" onChange={this.handleChange} value={this.state.code} />
                                    </MDBCol>
                                    <p>_____OR_____</p>
                                    <img src={qrImg} alt="QR Code" height="50px" width="50px"/>
                                    <br/><br/>
                                    <label>Scan the QR code on your product</label>
                                    <br/><br/>
                                    <MDBBtn onClick={this.verifyProduct}>Verify</MDBBtn>
                                </center>
                            </form>
                        </MDBJumbotron>
                    </MDBCol>
                </MDBRow>
                <OkModal show={this.state.show1} handleClose={this.hideModal1}></OkModal>
                <NotOkModal show={this.state.show2} handleClose={this.hideModal2}></NotOkModal>
                <TryAgainModal show={this.state.show3} handleClose={this.hideModal3}></TryAgainModal>
            </MDBContainer>
        );
    }
}

export default Verification;

//<NavLink to="/" exact><input class="homeButton" value="Home" name="verificationButton" type="button"/></NavLink>
