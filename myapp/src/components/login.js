import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../actions/loginActions';
import ValueExatractor from '../shared/ValueExatractor';
import { Alert } from 'react-bootstrap';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: true,
            loginError: false,
            submitted: false,
            loading: false,
            errorMsg: '',
            error: false,
            loginDetails: {
                username: { _value: "", touched: false, required: true, error: "", errorMsg: "This field is required." },
                password: { _value: "", touched: false, required: true, error: "", errorMsg: "This field is required." }
            },
            history: this.props.history
        }

        this.navigateToDashboard = this.navigateToDashboard.bind(this);
    }


    handleChange = (e) => {
        const { name, value } = e.target;
        var currentState = { ...this.state.loginDetails[name] }
        this.setState(prevState => {
            let loginDetails = Object.assign({}, prevState.loginDetails);  // creating copy of state variable jasper
            loginDetails[name]._value = value;
            loginDetails[name].touched = true;                      // update the name property, assign a new value                 
            return { loginDetails };                                 // return new object jasper object
        })
    }

    handleValidations() {
        let login = this.state.loginDetails;
        let error = false;
        for (var i in login) {
            if (login[i].required && !login[i]._value) {
                error = true;
            }
        }
        return error;
    }

    navigateToDashboard = () => {
        this.state.history.push("/user");
    }

    submitHandler = (e) => {

        e.preventDefault();
        this.setState({
            submitted: true
        })
        if (!this.handleValidations()) {
            let data = ValueExatractor(this.state.loginDetails);

            this.props.actions.login(data).then(() => {
                let { auth } = this.props.data;
                if (auth.status) {
                    this.setState({ ...this.state, msg: auth.message, })
                    this.navigateToDashboard();
                } else {
                    this.setState({ ...this.state, msg: auth.message, })
                }
            })
                .catch((err) => {
                    this.setState({ ...this.state, errors: err })
                })

        }
    }

    onChangePassword = (e) => {
        this.setState({ ...this.state, password: e.target.value })
    }


    onChangeEmail = (e) => {
        this.setState({ ...this.state, email: e.target.value })
    }


    render() {
        return (
            <React.Fragment>

                <div id="login">
                    <h3 className="text-center text-white pt-5">Login form</h3>
                    <div className="container">
                        <div id="login-row" className="row justify-content-center align-items-center">
                            <div id="login-column" className="col-md-6">
                                <div id="login-box" className="col-md-12">
                                    <form onSubmit={this.submitHandler} id="login-form" className="form" action="" method="post">
                                        <h3 className="text-center text-info">Login</h3>
                                        <div className={"form-group " + ((this.state.submitted || this.state.loginDetails.username.touched) && !this.state.loginDetails.username._value ? "has-error" : "")} >
                                            <input type="text" name="username" value={this.state.loginDetails.username._value} onChange={this.handleChange} className={"form-control " + ((this.state.submitted || this.state.loginDetails.username.touched) && !this.state.loginDetails.username._value ? "is-invalid" : "")} id="inputUn" placeholder="Username" />
                                            {(this.state.submitted || this.state.loginDetails.username.touched) && !this.state.loginDetails.username._value && <span className="text-danger">{this.state.loginDetails.username.errorMsg}</span>
                                            }
                                        </div>
                                        <div className={"form-group " + ((this.state.submitted || this.state.loginDetails.password.touched) && !this.state.loginDetails.password._value ? "has-error" : "")} >
                                            <input type="password" name="password" value={this.state.loginDetails.password._value} onChange={this.handleChange} className={"form-control " + ((this.state.submitted || this.state.loginDetails.password.touched) && !this.state.loginDetails.password._value ? "is-invalid" : "")} id="inputPwd" placeholder="Password" />
                                            {(this.state.submitted || this.state.loginDetails.password.touched) && !this.state.loginDetails.password._value && <span className="text-danger">{this.state.loginDetails.password.errorMsg}</span>
                                            }
                                        </div>

                                        {this.state.msg && <div className="col-md-12  text-center">
                                            <Alert variant={'danger'}>
                                                {this.state.msg}
                                            </Alert>
                                        </div>
                                        }
                                        <div className="form-group">
                                            <input type="submit" name="Submit" className="btn btn-primary btn-block" value="submit" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(loginActions, dispatch),
    };
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        data: state.login
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);