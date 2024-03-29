import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import PrivateRoutes from "./PrivateRoutes";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu,  MDBDropdownItem, MDBIcon } from "mdbreact";

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

    logout=()=>{
        console.log("logout");
        if(sessionStorage.getItem("user")){
            sessionStorage.removeItem("user");
            this.redirectUser('/');
        }
    }
    home=()=>{
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
                this.redirectUser('/');
            }
        }else{
            this.redirectUser('/');
        }
    }
    profile=()=>{
        this.redirectUser('/login/profile');
    }

    redirectUser = (path) => {
        this.props.history.push(path);
    }

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
                                        <MDBIcon icon="user" className="mr-1" />
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-default" right>
                                    <MDBDropdownItem onClick={this.home}>Home</MDBDropdownItem>
                                        <MDBDropdownItem onClick={this.profile}>Profile</MDBDropdownItem>
                                        <MDBDropdownItem onClick={this.logout}>Log out</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                {collapseID && overlay}
                <main className="wrapper" style={{ marginTop: "4rem" }}>
                    <PrivateRoutes />
                </main>
                <footer className="private-footer">
                    <p className="footer-copyright mb-0 py-3 text-center">
                        &copy; {new Date().getFullYear()} Copyright: Pharma Track
                    </p>
                </footer>
            </div>
        );
    }
}

export default PrivateLayout;
