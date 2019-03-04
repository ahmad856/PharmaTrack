import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import PublicRoutes from "./PublicRoutes";
import { NavLink } from 'react-router-dom';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse,   MDBNavItem, MDBFooter, MDBNavLink, MDBDropdown, MDBDropdownToggle, MDBIcon, MDBDropdownMenu, MDBBtn, MDBInput } from "mdbreact";

class PublicLayout extends Component {
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
                <MDBNavbar color="indigo" dark expand="md" fixed="top" scrolling>
                    <MDBNavbarBrand href="/">
                        Pharma Track
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse("mainNavbarCollapse")} />
                    <MDBCollapse id="mainNavbarCollapse" isOpen={this.state.collapseID} navbar>
                        <MDBNavbarNav right>
                            <MDBNavItem>
                                <MDBNavLink exact to="/" onClick={this.closeCollapse("mainNavbarCollapse")} >Home</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink onClick={this.closeCollapse("mainNavbarCollapse")} to="/verification" >Verification</MDBNavLink>
                            </MDBNavItem>

                            <MDBNavItem>
                                <MDBNavLink className="waves-effect waves-light" to="">
                                    <MDBIcon brand icon="google-plus" />
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <MDBIcon icon="user" />
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-default" right>
                                        <form>
                                            <p className="h5 text-center mb-4">Sign in</p>
                                            <div className="grey-text">
                                                <MDBInput label="Type your ID" icon="envelope" group type="text"/>
                                                <MDBInput label="Type your password" icon="lock" group type="password" validate/>
                                            </div>
                                            <div className="text-center">
                                                <NavLink to="/login/manufac" exact><MDBBtn size="sm">Login</MDBBtn></NavLink>
                                            </div>
                                        </form>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>

                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                {collapseID && overlay}
                <main style={{ marginTop: "4rem" }}>
                    <PublicRoutes />
                </main>
                <MDBFooter color="indigo">
                    <p className="footer-copyright mb-0 py-3 text-center">
                        &copy; {new Date().getFullYear()} Copyright: <a href="https://www.MDBootstrap.com"> MDBootstrap.com </a>
                    </p>
                </MDBFooter>
            </div>
        );
    }
}

export default PublicLayout;

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
