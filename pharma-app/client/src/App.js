import React, { Component } from 'react';
//import Modal from 'react-modal'
//import SlidingPane from 'react-sliding-pane';
import 'mdbreact/dist/css/mdb.css';
import PublicLayout from "./PublicLayout";
import PrivateLayout from "./PrivateLayout";
import { BrowserRouter,Route, Switch } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={PrivateLayout} />
                    <Route path='/' component={PublicLayout} />
                </Switch>
            </BrowserRouter>
        );
    }
}
export default App;

//<Logo style={{ height: '2.5rem', width: "2.5rem" }} />
