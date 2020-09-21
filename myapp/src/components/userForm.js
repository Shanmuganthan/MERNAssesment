import React, { Component, useState } from 'react'
import * as Icon from 'react-bootstrap-icons';
import ValueExatractor from '../shared/ValueExatractor';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux'
import * as userActions from '../actions/userActions';
import { getUserList } from '../reducers/userReducer';



import { bindActionCreators } from 'redux';
//mongod --dbpath "C:\Program Files\MongoDB\data\db" --storageEngine=mmapv1
/**
* @author
* @class UserForm
**/
let emirate = ["Abu Dhabi", "Al Ain", "Dubai", "Ras Al Khaimah", "Sharjah"]
class UserForm extends Component {
    constructor() {
        super();
        this.state = {
            submitted: false,
            loading: false,
            error: false,
            showModal: true,
            msg: '',
            alertType: false,
            userDetails: {
                firstName: { _value: "", touched: false, required: true, error: "", errorMsg: "This field is required." },
                lastName: { _value: "", touched: false, required: true, error: "", errorMsg: "This field is required." },
                email: { _value: "", touched: false, required: true, error: "", errorMsg: "This field is required." },
                emirate: { _value: "", touched: false, required: true, error: "", errorMsg: "This field is required." },
                mobile: { _value: "", touched: false, required: true, error: "", errorMsg: "This field is required." },
                dob: { _value: new Date(), touched: false, required: true, error: "", errorMsg: "This field is required." },
                role: { _value: "", touched: false, required: false, error: "", errorMsg: "This field is required." },
                password: { _value: "admin@123", touched: false, required: false, error: "", errorMsg: "This field is required." },

            }
        }
        this.handleChange = this.handleChange.bind(this);
    }


    componentDidMount() {
        if (this.props.id) {
            this.props.actions.fetchUserById(this.props.id).then(() => {
                this.setState(prevState => {
                    let data = this.props.user.userbyid;
                    let userDetails = Object.assign({}, prevState.userDetails);
                    for (let key of Object.keys(userDetails)) {
                        userDetails[key]._value = data[key];
                    }
                    return { userDetails };
                })
            })
                .catch((err) => {
                    this.setState({ ...this.state, errors: err })
                })
        }
    }


    handleDateChange(e) {
        this.setState(prevState => {
            let userDetails = Object.assign({}, this.state.userDetails);
            userDetails['dob']._value = e;
            userDetails['dob'].touched = true;
            return userDetails;
        })
    }
    handleChange(e) {
        let { name, value } = e.target;
        value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState(prevState => {
            let userDetails = Object.assign({}, this.state.userDetails);
            userDetails[name]._value = value;
            userDetails[name].touched = true;
            return userDetails;
        })
    }
    handleValidations() {
        let user = this.state.userDetails;
        let error = false;
        for (var i in user) {
            if (user[i].required && !user[i]._value) {
                error = true;
            }
        }
        return error;
    }


    submitHandler = (e) => {
        this.setState(prevState => {
            let submitted = true;
            return { submitted }
        })
        if (!this.handleValidations()) {
            let data = ValueExatractor(this.state.userDetails);

            if (!this.props.id) {
                this.props.actions.addUser(data).then(() => {
                    //this.props.history.push("/user");
                    let { user } = this.props.user;
                    if (user.success) {
                        this.setState({ ...this.state, msg: user.message, alertType: 'success' })
                        setTimeout(
                            () => { this.props.showModalFn(false) },
                            1000
                        )
                    } else {
                        this.setState({ ...this.state, msg: user.message, alertType: 'danger' })
                    }
                }).catch((err) => {
                    this.setState({ ...this.state, errors: err })
                })
            } else {
                data._id = this.props.user.userbyid._id;
                this.props.actions.editUser(data).then(() => {

                    let { user } = this.props.user;
                    console.log(user);
                    if (user.success) {
                        this.setState({ ...this.state, msg: user.message, alertType: 'success' })
                        setTimeout(
                            () => { this.props.showModalFn(false) },
                            1000
                        )
                    } else {
                        this.setState({ ...this.state, msg: user.message, alertType: 'danger' })
                    }
                }).catch((err) => {
                    this.setState({ ...this.state, errors: err })
                })
            }
        }
    }

    render() {
        return (
            <Modal
                show={this.state.showModal}
                centered
                size="lg"
                onHide={() => this.props.showModalFn(false)}
                aria-labelledby="ModalHeader"
            >
                <Modal.Header closeButton>
                    <Modal.Title id='ModalHeader'>{'Add New User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input className={"form-control " + ((this.state.submitted || this.state.userDetails.firstName.touched) && !this.state.userDetails.firstName._value ? "is-invalid" : "")} name="firstName" id="FirstName" onChange={(event) => this.handleChange(event)} value={this.state.userDetails.firstName._value} />
                                {(this.state.submitted || this.state.userDetails.firstName.touched) && !this.state.userDetails.firstName._value && <span className="text-danger">{this.state.userDetails.firstName.errorMsg}</span>}
                            </div>

                            <div className="col-md-6 form-group">
                                <label htmlFor="email">Last Name</label>
                                <input className={"form-control " + ((this.state.submitted || this.state.userDetails.email.touched) && !this.state.userDetails.lastName._value ? "is-invalid" : "")} name="lastName" id="lastName" onChange={(event) => this.handleChange(event)} value={this.state.userDetails.lastName._value} />

                                {(this.state.submitted || this.state.userDetails.lastName.touched) && !this.state.userDetails.lastName._value && <span className="text-danger">{this.state.userDetails.lastName.errorMsg}</span>}
                            </div>


                            <div className="col-md-6 form-group">
                                <label htmlFor="email">email</label>
                                <input className={"form-control " + ((this.state.submitted || this.state.userDetails.email.touched) && !this.state.userDetails.email._value ? "is-invalid" : "")} name="email" id="email" onChange={(event) => this.handleChange(event)} value={this.state.userDetails.email._value} />

                                {(this.state.submitted || this.state.userDetails.email.touched) && !this.state.userDetails.email._value && <span className="text-danger">{this.state.userDetails.email.errorMsg}</span>}
                            </div>
                            <div className="col-md-6 form-group">
                                <label htmlFor="mobile">mobile</label>
                                <input type="text" className={"form-control " + ((this.state.submitted || this.state.userDetails.mobile.touched) && !this.state.userDetails.mobile._value ? "is-invalid" : "")} name="mobile" id="mobile" onChange={(event) => this.handleChange(event)} value={this.state.userDetails.mobile._value} />
                                {(this.state.submitted || this.state.userDetails.mobile.touched) && !this.state.userDetails.mobile._value && <span className="text-danger">{this.state.userDetails.mobile.errorMsg}</span>}
                            </div>



                            <div className="col-md-6 form-group">
                                <label htmlFor="emirate">Emirate</label>
                                <select className={"form-control " + ((this.state.submitted || this.state.userDetails.emirate.touched) && !this.state.userDetails.emirate._value ? "is-invalid" : "")} name="emirate" id="emirate" onChange={(event) => this.handleChange(event)} value={this.state.userDetails.emirate._value}>

                                    <option disabled value="">Choose the Emirates</option>
                                    {
                                        [...emirate].map(data => {
                                            return (<option key={data} value={data}>{data}</option>)
                                        })
                                    }
                                </select>
                                {(this.state.submitted || this.state.userDetails.emirate.touched) && !this.state.userDetails.emirate._value && <span className="text-danger">{this.state.userDetails.emirate.errorMsg}</span>}
                            </div>

                            <div className="col-md-6 form-group">
                                <label style={{ display: "block" }} htmlFor="lastNamelastName">dob</label>
                                {/* <input  /> */}
                                <DatePicker
                                    selected={this.state.userDetails.dob._value}
                                    className={"form-control " + ((this.state.submitted || this.state.userDetails.dob.touched) && !this.state.userDetails.dob._value ? "is-invalid" : "")} name="dob" id="dob" onChange={(event) => this.handleDateChange(event)} value={this.state.userDetails.dob._value}
                                />
                                {(this.state.submitted || this.state.userDetails.dob.touched) && !this.state.userDetails.dob._value && <span className="text-danger">{this.state.userDetails.dob.errorMsg}</span>}
                            </div>



                            {this.state.msg && <div className="col-md-12  text-center">
                                <Alert variant={this.state.alertType}>
                                    {this.state.msg}
                                </Alert>
                            </div>
                            }

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.props.showModalFn(false)} className='btn btn-primary' >
                        Cancel
                    </button>
                    <button onClick={() => this.submitHandler()} className='btn btn-success' >
                        {this.state.btnTxt || 'Create'}
                    </button>
                </Modal.Footer>
            </Modal>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(userActions, dispatch),

    };
}
const mapStateToProps = (state) => {
    return {
        user: getUserList(state),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);