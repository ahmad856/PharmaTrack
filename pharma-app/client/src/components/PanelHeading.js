import React from "react";
import { MDBRow } from "mdbreact";

const PanelHeading = props => {
    return (
        <div>
            <MDBRow className="align-items-center mt-5">
                <h3 className="black-text" style={{ margin: "10px" }}>
                    <strong>{props.title}</strong>
                </h3>
            </MDBRow>
            <hr className="mb-5" />
        </div>
    );
};

export default PanelHeading;
