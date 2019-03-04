import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import ManufacturerPanel from "./pages/ManufacturerPanel";

class PrivateRoutes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/login/manufac" component={ManufacturerPanel} />
                <Route
                    render={function () {
                        return <h1>Page Not Found</h1>;
                    }}
                />
            </Switch>
        );
    }
}

export default PrivateRoutes;
