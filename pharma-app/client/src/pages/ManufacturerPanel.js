import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBCard, MDBCardHeader, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem, MDBRow } from "mdbreact";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import classnames from 'classnames';
import PanelHeading from "../components/PanelHeading";
import { Row, Col } from 'react-bootstrap'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

class BSTable extends React.Component {
    render() {
        if (this.props.data) {
            return (
                <MDBContainer>
                <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                    <MDBCardHeader> Asset Details</MDBCardHeader>
                    <MDBCardBody className="text-info">
                        <MDBRow className="justify-content-center">
                            <MDBListGroup className="my-4 mx-4" style={{ width: "20rem" }}>
                                <MDBListGroupItem color="primary">Description: Panadol Tablet</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Price: 45</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Timestamp: 1234343</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Type: Tablets</MDBListGroupItem>
                            </MDBListGroup>
                            <MDBListGroup className="my-4 mx-4" style={{ width: "20rem" }}>
                                <MDBListGroupItem color="primary">Salt: paracetamol</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Quantity: 3452</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Mfg Date: Jan. 1, 2018</MDBListGroupItem>
                                <MDBListGroupItem color="primary">Expiry Date: Jan. 1, 2020</MDBListGroupItem>
                            </MDBListGroup>
                        </MDBRow>
                        <center><MDBBtn size="sm" color="primary">Show Details</MDBBtn></center>
                    </MDBCardBody>
                </MDBCard>
                </MDBContainer>
            );
        } else {
            return (
                <MDBCard border="info" className="m-3" style={{ maxWidth: "70rem" }}>
                    <MDBCardHeader>Asset Details</MDBCardHeader>
                    <MDBCardBody className="text-info">
                        <center><MDBCardText>Details not found!!!</MDBCardText></center>
                    </MDBCardBody>
                </MDBCard>
            );
        }
    }
}

class ManufacturerPanel extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state={};
        this.state.activeTab="1";
        this.state.isPaneOpen=false;
        this.state.assetTypes=['Medicines', 'Surgical Instruments'];
        this.state.nameValue="";
        this.state.priceValue="";
        this.state.typeValue="";
        this.state.qtyValue="";
        this.state.errors={nameVal:'',priceVal:'',typeVal:'',qtyVal:''};
        this.state.nameValid=false;
        this.state.priceValid=false;
        this.state.qtyValid=false;
        this.state.typeValid=false;
        this.state.formValid=false;
        this.state.response="";
        this.state.responseToPost="";
        this.state.post="";
        this.state.assets = [];
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state.key="asset";
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        },()=>{this.validate(name,value)});
    };

    isExpandableRow(row) {
        return true;
    }

    expandComponent(row) {
        return (
            <BSTable data={ row } />
        );
    }

    validate(name,value){
        var fieldErrors=this.state.errors;
        var nameValid=this.state.nameValid;
        var priceValid=this.state.priceValid;
        var qtyValid=this.state.qtyValid;
        var typeValid=this.state.typeValid;
        switch(name){
            case 'nameValue':
                nameValid = value.length > 0;
                fieldErrors.nameVal = nameValid ? '' : ' is Empty!!!';
                break;
            case 'priceValue':
                priceValid = value.length > 0;
                fieldErrors.priceVal = priceValid ? '' : ' is Empty!!!';
                break;
            case 'typeValue':
                typeValid = value.length > 0;
                fieldErrors.typeVal = typeValid ? '' : ' is Empty!!!';
                break;
            case 'qtyValue':
                qtyValid = value.length > 0;
                fieldErrors.qtyVal = qtyValid ? '' : ' is Empty!!!';
                break;
        }

        this.setState({
            errors: fieldErrors,
            nameValid: nameValid,
            priceValid: priceValid,
            typeValid: typeValid,
            qtyValid: qtyValid,
            }, this.validateF);
    }

    validateF() {
        this.setState({formValid: this.state.nameValid && this.state.priceValid && this.state.qtyValid && this.state.typeValid});
    }

    assetNameValidator(value, row) {
        const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
        if (!value) {
            response.isValid = false;
            response.notification.type = 'error';
            response.notification.msg = 'Value must be inserted';
            response.notification.title = 'Requested Value';
        } else if (value.length < 4) {
            response.isValid = false;
            response.notification.type = 'error';
            response.notification.msg = 'Value must have 4+ characters';
            response.notification.title = 'Invalid Value';
        }
        return response;
    }

    assetStatusValidator(value, row) {
        const nan = isNaN(parseInt(value, 10));
        if (nan) {
            return 'Asset Status must be a integer!';
        }
        return true;
    }

    closePanel = () => {
        this.setState({ isPaneOpen: false,
            nameValue:'',
            priceValue:'',
            typeValue:'',
            qtyValue:'',
            errors:{nameVal:'',priceVal:'',typeVal:'',qtyVal:''},
            nameValid:false,
            priceValid:false,
            qtyValid:false,
            typeValid:false,
            formValid:false
        });
    };

    handleAddAsset(name,price,type,quantity) {
        var asset = {
            Key: name,
            name: price,
            owner: type,
            timestamp: quantity
        }
        this.state.assets.push(asset);
        this.setState(this.state.assets);
    };

    //tasks.map((task) => task.name )
    display=()=>{
        console.log(this.state.assets);
    }

    flattenData (assets_array) {
        var temp_asset=[];
        for(let i=0;i<assets_array.length;i++){
            var temp={};
            temp['Key']=assets_array[i].Key;
            temp['Name']=assets_array[i].Record.name;
            temp['Owner']=assets_array[i].Record.owner;
            temp['TimeStamp']=assets_array[i].Record.timestamp;
            temp_asset.push(temp);
        }
        return temp_asset;
    }

    handleSubmit = async e => {
        this.handleAddAsset(this.state.nameValue,this.state.priceValue,this.state.typeValue,this.state.qtyValue);
        var name=this.state.nameValue;
        var price=this.state.priceValue;
        var type=this.state.typeValue;
        var qty=this.state.qtyValue;
        this.closePanel();
        e.preventDefault();
        const response = await fetch('/api/world', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: name.concat('-',price,'-',type,'-',qty) })
        });
        console.log("Assets");
        console.log(this.state.assets);
        console.log(response.text());
        const body = await response.text();
        this.setState({ responseToPost: body });
    };

    // componentDidMount() {
    //     this.setState({assets:this.flattenData([{"Key":"1","Record":{"name":"panadol","owner":"Miriam","timestamp":"1504054225"}},{"Key":"2","Record":{"name":"xyzal","owner":"Ahmad","timestamp":"1504057825"},},{"Key":"3","Record":{"name":"castine","owner":"Igor","timestamp":"1493517025"}},{"Key":"4", "Record":{"name":"panadol extra","owner":"Amalea","timestamp":"1496105425"}},{"Key":"5", "Record":{"name":"calpol","owner":"Rafa","timestamp":"1493512301"}},{"Key":"6", "Record":{"name":"brufen","owner":"Shen","timestamp":"1494117101"}},{"Key":"7", "Record":{"name":"paracetamol","owner":"Leila","timestamp":"1496104301"}},{"Key":"8", "Record":{"name":"panadol","owner":"Miriam","timestamp":"1504054225"}},{"Key":"9", "Record":{"name":"xyzal","owner":"Dave","timestamp":"1504057825"}},{"Key":"10", "Record":{"name":"castine","owner":"Igor","timestamp":"1493517025"}},{"Key":"11", "Record":{"name":"panadol extra","owner":"Amalea","timestamp":"1496105425"}},{"Key":"12", "Record":{"name":"calpol","owner":"Rafa","timestamp":"1493512301"}},{"Key":"13", "Record":{"name":"brufen","owner":"Shen","timestamp":"1494117101"}},{"Key":"14", "Record":{"name":"paracetamol","owner":"Leila","timestamp":"1496104301"}}])});
    //     console.log(this.state.assets);
    // }

    componentDidMount() {
        this.callApi()
        .then(res => this.setState({ assets: res.express }))
        .catch(err => console.log(err));
        console.log("Assets");
        console.log(this.state.assets);
    }

    callApi = async () => {
        const response = await fetch('/api/hello');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log(body);
        return body;
    };

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    //height='240' scrollTop={ 'Top' }

    render() {
        const options = {
            onlyOneExpanding: true,
            page:1, sizePerPageList: [ { text: '10', value: 10 }, { text: '20', value: 20 }, { text: '50', value: 50 }, { text: 'All', value: this.state.assets.length } ],
            sizePerPage: 10, pageStartIndex: 1, paginationSize: 3, prePage: 'Prev', nextPage: 'Next', firstPage: 'First', lastPage: 'Last', paginationPosition: 'top'
        }

        return (
            <MDBContainer>
                <PanelHeading title="Manufacturer Panel"/>

                <Nav tabs pills>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>Asset</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>Distributor</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>Transaction</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm={12}>
                                <MDBBtn size="sm" color="primary" onClick={this.display} >Add Asset</MDBBtn>
                                <BootstrapTable data={ this.state.assets } version='4' hover condensed pagination expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } options={ options }>
                                    <TableHeaderColumn isKey dataField='Key'>Asset ID</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Owner' filter={{ type: 'TextFilter', delay: 100 }}>Asset Owner</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Name' filter={{ type: 'TextFilter', delay: 100 }}>Asset Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField='TimeStamp' filter={{ type: 'TextFilter', delay: 100 }}>Time Stamp</TableHeaderColumn>
                                </BootstrapTable>
                                <br/><br/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm={12}>
                                <h4>Tab 2 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <Row>
                            <Col sm={12}>
                                <h4>Tab 3 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>

            </MDBContainer>
        );
    }
}

export default ManufacturerPanel;
