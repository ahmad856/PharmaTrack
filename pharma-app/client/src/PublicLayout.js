import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import PublicRoutes from "./PublicRoutes";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse,   MDBNavItem, MDBNavLink, MDBDropdown, MDBDropdownToggle, MDBIcon, MDBDropdownMenu, MDBBtn, MDBInput } from "mdbreact";

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
        .then()
        .catch(err => console.log(err));
    }

    redirectUser = (path) => {
        this.props.history.push(path);
    }

    loginfunc = async () => {
        var id=this.state.id;
        var password=this.state.password;
        const response = await fetch('/sign_in/'+id+'/'+password);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if(body.express.status===1){
             sessionStorage.setItem("user",id);
            if(body.express.userSighnedIn===1){
                this.redirectUser('/login/admin');
            }else if(body.express.userSighnedIn===2){
                this.redirectUser('/login/manufac');
            }else if(body.express.userSighnedIn===3){
                this.redirectUser('/login/dist');
            }else if(body.express.userSighnedIn===4){
                this.redirectUser('/login/chem');
            }else{
                console.log("user not valid");
            }
        }else if(body.express.status===-2){
            console.log("user password not valid!!!");
        }else{
            console.log("user not found!!!");
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
