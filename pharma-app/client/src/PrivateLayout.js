import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import PrivateRoutes from "./PrivateRoutes";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu,  MDBDropdownItem, MDBIcon, MDBFooter } from "mdbreact";

class PrivateLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseID:""
        };
    }

    toggleCollapse = collapseID => () =>
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
        })
    );

    closeCollapse = collapseID => () =>
        this.state.collapseID === collapseID && this.setState({ collapseID: "" });

    render() {
        const overlay = (
            <div id="sidenav-overlay" style={{ backgroundColor: "transparent" }} onClick={this.toggleCollapse("mainNavbarCollapse")} />
        );

        const { collapseID } = this.state;

        return (
            <div className="flyout">
                <MDBNavbar color="info-color" dark expand="md" fixed="top" scrolling>
                    <MDBNavbarBrand>
                        <strong className="white-text">Pharma Track</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse("navbarCollapse3")} />
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.collapseID} navbar>
                        <MDBNavbarNav right>
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="user" className="mr-1" />Profile
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-default" right>
                                        <MDBDropdownItem href="/">Log out</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                {collapseID && overlay}
                <main style={{ marginTop: "4rem" }}>
                    <PrivateRoutes />
                </main>
                <MDBFooter color="info-color">
                    <p className="footer-copyright mb-0 py-3 text-center">
                        &copy; {new Date().getFullYear()} Copyright: <a href="https://www.MDBootstrap.com"> MDBootstrap.com </a>
                    </p>
                </MDBFooter>
            </div>
        );
    }
}

export default PrivateLayout;

//<Logo style={{ height: '2.5rem', width: "2.5rem" }} />

// const LoginModal = ({ handleClose, show, children }) => {
//     const showHideClassName = show ? "modal display-block" : "modal display-none";
//     return (
//         <div className={showHideClassName}>
//             <section className="modal-main">
//                   <button class="modalCloseButton" onClick={handleClose}>[ X ]</button>
//                 {children}
//                 <br/><br/>
//             </section>
//         </div>
//     );
// };

// constructor(props) {
//     super(props);
//     this.state = {
//         show: false,
//         id:'',
//         pass:'',
//         errors:{idVal:'',passVal:''},
//         idValid:false,
//         passValid:false,
//         formValid:false
//     };
//     this.handleInputChange = this.handleInputChange.bind(this);
// };
// showModal = () => {
//     this.setState({ show: true });
// };
// hideModal = () => {
//     this.setState({ show: false,
//         id:'',
//         pass:'',
//         errors:{idVal:'',passVal:''},
//         idValid:false,
//         passValid:false,
//         formValid:false
//     });
// };
// handleInputChange(event) {
//     const target = event.target;
//     const value = target.value;
//     const name = target.name;
//     this.setState({
//         [name]: value
//     },()=>{this.validate(name,value)});
// };
//
// validate(name,value){
//     var fieldErrors=this.state.errors;
//     var idValid=this.state.idValid;
//     var passValid=this.state.passValid;
//     switch(name){
//         case 'id':
//             idValid = value.length > 0;
//             fieldErrors.idVal = idValid ? '' : ' is Empty!!!';
//             break;
//         case 'pass':
//             passValid = value.length > 0;
//             fieldErrors.passVal = passValid ? '' : ' is Empty!!!';
//             break;
//     }
//
//     this.setState({
//         errors: fieldErrors,
//         idValid: idValid,
//         passValid: passValid,
//         }, this.validateF);
// }
//
// validateF() {
//     this.setState({formValid: this.state.idValid && this.state.passValid});
// }

// <LoginModal show={this.state.show} handleClose={this.hideModal}>
//     <br/><br/>
//     <center><label class="subHeading">LOGIN</label></center>
//     <br/>
//     <form>
//         <label class="fixTitle">Identification : <span>*</span></label>
//         <input class="fixTitleInput" name="id" type="text" value={this.state.id} onChange={this.handleInputChange}/>
//         <br /> <br />
//         <label class="fixTitle">Password : <span>*</span></label>
//         <input class="fixTitleInput" name="pass" type="password" min="1" value={this.state.pass} onChange={this.handleInputChange}/>
//         <br /> <br /><br /> <br />
//         <center><NavLink to="/manufac" exact><button disabled={!this.state.formValid} type="button">Add</button></NavLink></center>
//     </form>
// </LoginModal>
