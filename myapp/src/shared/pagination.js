import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
* @author
* @class Pagination
**/

class Pagination extends Component {
    constructor() {
        super();
        this.state = {
            currentPage: 0,
            list: []
        }
        this.pagination = this.pagination.bind(this);
        this.generatePagination = this.generatePagination.bind(this);
    }

    pagination(c, m) {
        var current = c,
            last = m,
            delta = 5,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;

        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    }

    generatePagination(){
        
        this.setState(prevState => {
            let list = Object.assign({}, this.state.list);
            list = this.pagination(this.state.currentPage, Math.ceil(this.props.count / this.props.perpage));
            return { list };
        })
        
    }
   
    pageClicked(data,e){
        e.preventDefault();
       this.props.handlePaginationAction(data);
    }
    componentWillReceiveProps(data){
        this.setState(prevState=>{
            let currentPage = Object.assign({},this.state.currentPage);
            currentPage = data.currentPage;
            // let list = Object.assign({}, this.state.list);
            // list = this.pagination(data.currentPage, Math.ceil(this.props.count / this.props.perpage));
            return {  currentPage };
        },()=>{
                 this.generatePagination();
        })
        
    }

    render() {
        return (
            <div>
                <ul className="pagination">
                    {
                        this.state.list && this.state.list.map((data,index) => {
                            return (<li onClick={(e)=>this.pageClicked(data,e)} key={index} data-id={data} className={"page-item" + ( this.state.currentPage == data ? " active" : "" ) + (data == "..." ? " disabled" : "")}>
                                <a className={"page-link" }  href="#">
                                    {data}
                                </a>
                            </li>)
                        })
                    }
                </ul>
            </div>
        )
    }
}


Pagination.propTypes = {}
export default Pagination