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
                <footer class="public-footer">
                    <p className="footer-copyright mb-0 py-3 text-center">
                        &copy; {new Date().getFullYear()} Copyright: Pharma Track
                    </p>
                </footer>
            </div>
        );
    }
}

export default PublicLayout;
