import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Verification from "./pages/Verification";

class PublicRoutes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/verification" component={Verification}/>
                <Route
                    render={function () {
                        return <h1>Page Not Found!!!</h1>;
                    }}
                />
            </Switch>
        );
    }
}

export default PublicRoutes;
