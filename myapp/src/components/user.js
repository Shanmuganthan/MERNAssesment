import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as userActions from '../actions/userActions';
import { getUserList } from '../reducers/userReducer';

import { bindActionCreators } from 'redux';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import Pagination from '../shared/pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserForm from './userForm';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            _id: 0,
            pageNo: 1,
            pageLimit: 10,
            totalCount: 0,
            showModal: false,
            btnTxt: 'Save',
            title: '',
            loading: true,
            data: [],
            sort: [{ field: "_id", order: "desc" }],
        }
        this.showModalFn = this.showModalFn.bind(this);
        this.handlePagination = this.handlePagination.bind(this);

    }
    fecthData() {
        this.props.actions.fetchUserList(this.state.search, this.state.sort[0], this.state.pageNo, this.state.pageLimit).then(() => {
            this.setState(prevState => {
                let data = this.props.user;
                data = data.userlist;
                let loading = false;
                return { data, loading }
            })
        })
            .catch((err) => {
                this.setState({ ...this.state, errors: err })
            })

    }
    fecthDataCount() {
        this.props.actions.fetchUserCount(this.state.search).then(() => {
            this.setState({ ...this.state, totalCount: this.props.user.usercount })
        }).catch((err) => {
            this.setState({ ...this.state, errors: err })
        })

    }

    componentDidMount() {
        this.fecthDataCount();
        this.fecthData();
    }

    handlePagination(data) {
        this.setState(prevState => {
            let pageNo = Object.assign({}, this.state.pageNo);
            pageNo = data;
            return { pageNo };

        }, () => {
            this.fecthData();
        })
    }

    onSort = (event, sortKey) => {
        this.setState(prevState => {
            let sort = Object.assign({}, this.state.sort);
            let order = prevState.sort[0].field == sortKey ? prevState.sort[0].order == "asc" ? "desc" : "asc" : "asc";
            let field = sortKey;
            sort[0] = { field: field, order: order };
            return { sort };
        }, () => {
            this.fecthData();
        })
    }

    deleteData(id) {
        this.props.actions.deleteUserById(id).then(() => {
            console.log(this.props);
            toast.success(this.props.user.deleteuser.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }).catch((err) => {
            this.setState({ ...this.state, errors: err })
        })

    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(prevState => {
            let search = Object.assign({}, prevState.search);  // creating copy of state variable jasper
            search = value;
            return { search };                                 // return new object jasper object
        }, () => {
            this.fecthDataCount();
            this.fecthData();
        })
    }
    searchClick() {
        this.fecthDataCount();
        this.fecthData();
    }
    showModalFn(data) {
        this.setState(prevState => {
            let showModal = Object.assign({}, prevState.showModal);
            let title = Object.assign({}, prevState.title);
            let btnTxt = Object.assign({}, prevState.btnTxt);
            let _id = Object.assign({}, prevState._id);
            showModal = data;
            title = 'Add New User';
            btnTxt = 'Create';
            _id = undefined;
            return { showModal, title, btnTxt, _id };
        }, () => {
            if (!data) {
                this.fecthData();
                this.fecthDataCount()
            }
        })

    }

    editData(id) {
        console.log(id)
        this.setState(prevState => {
            let showModal = Object.assign({}, prevState.showModal);
            let title = Object.assign({}, prevState.title);
            let btnTxt = Object.assign({}, prevState.btnTxt);
            let _id = Object.assign({}, prevState._id);
            showModal = true;
            title = 'Update Order';
            btnTxt = 'Update';
            _id = id;
            return { _id, showModal, title, btnTxt };
        })
    }



    render() {
        let User = "Not selected book !"
        if (this.props.activeBook) {
            User = this.props.activeBook.title
        }
        return (
            <React.Fragment>

                {this.state.showModal && <UserForm id={this.state._id} showModalFn={this.showModalFn} />}

                <div className="mar-top-30">
                    <div className="col-md-12">
                        <div className="col-md-12 mar-top-30" >
                            <div className="table-caption">
                                <div className="row">
                                    <div className="col-md-4 input-group">
                                        <input type="text" name="search" max="20" onChange={(event) => this.handleChange(event)} placeholder="Search" className="form-control" />
                                        <Icon.Search className="input-search" onClick={() => this.searchClick()} size={20} />
                                    </div>
                                    <div className="col-md-8  ">
                                        <button onClick={() => this.showModalFn(true)} className="btn btn-success float-right" >   Add User</button>
                                    </div>
                                </div>
                            </div>
                            <table className="table table-border  table-striped">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th onClick={e => this.onSort(e, 'firstName')} className="is-sort"> Name
                                        {this.state.sort[0].field == "firstName" && this.state.sort[0].order == "asc" &&
                                                <Icon.ArrowUp />
                                            }
                                            {this.state.sort[0].field == "firstName" && this.state.sort[0].order == "desc" &&
                                                <Icon.ArrowDown />
                                            }
                                        </th>
                                        <th onClick={e => this.onSort(e, 'email')} className="is-sort"> Email
                                        {this.state.sort[0].field == "email" && this.state.sort[0].order == "asc" &&
                                                <Icon.ArrowUp />
                                            }
                                            {this.state.sort[0].field == "email" && this.state.sort[0].order == "desc" &&
                                                <Icon.ArrowDown />
                                            }
                                        </th>
                                        <th onClick={e => this.onSort(e, 'mobile')} className="is-sort"> Mobile
                                        {this.state.sort[0].field == "mobile" && this.state.sort[0].order == "asc" &&
                                                <Icon.ArrowUp />
                                            }
                                            {this.state.sort[0].field == "mobile" && this.state.sort[0].order == "desc" &&
                                                <Icon.ArrowDown />
                                            }
                                        </th>
                                        <th onClick={e => this.onSort(e, 'emirate')} className="is-sort">Emirate
                                        {this.state.sort[0].field == "emirate" && this.state.sort[0].order == "asc" &&
                                                <Icon.ArrowUp />
                                            }
                                            {this.state.sort[0].field == "emirate" && this.state.sort[0].order == "desc" &&
                                                <Icon.ArrowDown />
                                            }
                                        </th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data &&
                                        this.state.data.map((data, index) => {
                                            return (<tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data.firstName} {data.lastName}</td>
                                                <td>{data.mobile}</td>
                                                <td>{data.email}</td>
                                                <td>{data.emirate}</td>

                                                <td className="action">
                                                    <span onClick={() => this.editData(data._id)}><Icon.Pencil size={20} /></span>
                                                    <span onClick={() => this.deleteData(data._id)}> <Icon.Trash size={20} /></span>
                                                </td>
                                            </tr>
                                            )
                                        })
                                    }
                                    {
                                        this.state.data.length == 0 && !this.state.loading &&
                                        <tr><td colSpan="6" className="text-center" >No Result Found</td></tr>
                                    }
                                    {
                                        this.state.loading &&
                                        <tr><td colSpan="6" className="text-center" >Loading</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-12">
                            <div className="float-right">
                                {this.state.totalCount > 0 && <Pagination ref="pagination" currentPage={this.state.pageNo == 0 ? 1 : this.state.pageNo} handlePaginationAction={this.handlePagination} count={this.state.totalCount} perpage={this.state.pageLimit} />}
                            </div>
                        </div>
                    </div>
                </div>



            </React.Fragment>
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
        user: getUserList(state)
    }
}

// mapDispatchToProps,
export default connect(mapStateToProps, mapDispatchToProps)(User);