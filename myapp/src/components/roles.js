import React, {Component} from 'react'
import { connect } from 'react-redux'

class Roles extends Component {
    render() {
        let Roles = "Not selected book !"
        if (this.props.activeBook) {
            Roles = this.props.activeBook.title
        }
        return (
            <div>{Roles}</div>
        )
    }
}

function mapStateToProps(state) {
    return { activeBook: state.activeBook }
}

export default connect(mapStateToProps)(Roles)
