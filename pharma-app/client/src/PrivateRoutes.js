import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import ManufacturerPanel from "./pages/ManufacturerPanel";
import DistributorPanel from "./pages/DistributorPanel";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";

class PrivateRoutes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/login/manufac" component={ManufacturerPanel} />
                <Route exact path="/login/dist" component={DistributorPanel} />
                <Route exact path="/login/admin" component={AdminPanel} />
                <Route exact path="/login/profile" component={Profile} />
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

// <Route exact path="/login/chem" component={ManufacturerPanel} />
