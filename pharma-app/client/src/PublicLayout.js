import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import PublicRoutes from "./PublicRoutes";
import { NavLink } from 'react-router-dom';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse,   MDBNavItem, MDBFooter, MDBNavLink, MDBDropdown, MDBDropdownToggle, MDBIcon, MDBDropdownMenu, MDBBtn, MDBInput } from "mdbreact";

class PublicLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseID:"",
            id:"",
            password:"",
            user:""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    toggleCollapse = collapseID => () =>
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
        })
    );

    closeCollapse = collapseID => () =>
        this.state.collapseID === collapseID && this.setState({ collapseID: "" });

    handleLoginSubmit = () =>{
        this.loginfunc()
        .then(res => this.setState({ user: res.express }))
        .catch(err => console.log(err));
        //this.redirect();
    }

    redirectUser = (path) => {
        this.props.history.push(path);
    }

    loginfunc = async () => {
        var id=this.state.id;
        const response = await fetch('/user_login/'+id);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log(body);
        if(body.id===this.state.id && body.password===this.state.password){
            sessionStorage.setItem("user",body.id);
            if(this.state.id.substring(0,4)==="dist"){
                this.redirectUser('/login/dist');
            } else if(this.state.id.substring(0,4)==="chem"){
                this.redirectUser('/login/chem');
            } else if(this.state.id.substring(0,4)==="manu"){
                this.redirectUser('/login/manufac');
            } else if(this.state.id.substring(0,4)==="admi"){
                this.redirectUser('/login/admin');
            }
        }
        else{
            console.log("user not found");
        }
        return body;
    };

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
                                    <MDBDropdownToggle nav caret><MDBIcon icon="user" /></MDBDropdownToggle>
                                    <MDBDropdownMenu basic>
                                        <div>
                                            <form>
                                                <p className="h5 text-center mb-4">Sign in</p>
                                                <MDBInput style={{color:"black"}} label="ID" type="text" name="id" value={this.state.id} onChange={this.handleInputChange}/>
                                                <MDBInput label="Password" style={{color:"black"}} type="password" name="password" value={this.state.password} onChange={this.handleInputChange}/>
                                                <div className="text-center">
                                                    <MDBBtn size="sm" onClick={this.handleLoginSubmit}>Login</MDBBtn>
                                                </div>
                                            </form>
                                        </div>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>

                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                {collapseID && overlay}
                <main class="wrapper" style={{ marginTop: "4rem" }}>
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
