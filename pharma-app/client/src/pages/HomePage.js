import React, { Component } from 'react';
import { MDBEdgeHeader, MDBFreeBird, MDBContainer, MDBCol, MDBRow, MDBCardBody } from "mdbreact";

class HomePage extends Component {
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
    render() {
        return (
            <div>
                <MDBEdgeHeader color="indigo darken-3" />
                <MDBFreeBird>
                    <MDBRow>
                        <MDBCol md="10" className="mx-auto float-none white z-depth-1 py-2 px-2">
                            <MDBCardBody>
                                <h2 className="h2-responsive mb-4"><strong>Pharma Track</strong></h2>
                                <p>Highest possible transparency in pharmaceutical packaging process to protect the patience safety, due to traceability of each single unit.</p>
                            </MDBCardBody>
                        </MDBCol>
                    </MDBRow>
                </MDBFreeBird>

                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="10" className="mx-auto mt-4">
                            <h2 className="text-center my-4 font-weight-bold">
                                Why Pharma Track?
                            </h2>
                            <p className="text-center">
                                Pharma Track is a two-way assets tracking system which allows end-users and the industries
                                to track their pharmaceuticals i.e. the path from the manufacturing plant, through various
                                distributions, and finally to the customers. Users will be able to track the products, hence
                                assuring their security, quality and authenticity. This project employs Blockchain as core and
                                user interface will be based on Web, iOS and Android
                            </p>
                            <hr className="my-5" />
                            <h2 className="text-center my-4 font-weight-bold">
                                Our Team
                            </h2>
                            <MDBRow id="categories" center>
                                <MDBCol md="4" className="mb-5">
                                    <MDBCol size="10" md="8" lg="10" className="float-right">
                                        <h4 className="font-weight-bold">Abdullah Kamran</h4>
                                        <p className="grey-text">
                                          Blockchain/Controller guy!!!
                                        </p>
                                    </MDBCol>
                                </MDBCol>
                                <MDBCol md="4" className="mb-5">
                                    <MDBCol size="10" md="8" lg="10" className="float-right">
                                        <h4 className="font-weight-bold">M. Ahmad Shahid</h4>
                                        <p className="grey-text">
                                          Team Lead/Front End/controller!!!
                                        </p>
                                    </MDBCol>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow id="categories" center>
                                <MDBCol md="4" className="mb-5">
                                    <MDBCol size="10" md="8" lg="10" className="float-right">
                                        <h4 className="font-weight-bold">Rehan Ahmad</h4>
                                        <p className="grey-text">
                                            Networking guy!!!!
                                        </p>
                                    </MDBCol>
                                </MDBCol>
                                <MDBCol md="4" className="mb-5">
                                    <MDBCol size="10" md="8" lg="10" className="float-right">
                                        <h4 className="font-weight-bold">Muhammad Usama Saqib</h4>
                                        <p className="grey-text">
                                            Front end guy!!!
                                        </p>
                                    </MDBCol>
                                </MDBCol>
                            </MDBRow>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }
}

export default HomePage;
