import React from 'react'
import { connect } from 'react-redux'
import { USER_ROLES } from '../utils/constants'
import SubjectList from './Student/SubjectList'

class StudentHome extends React.Component {
    render() {
        if (!this.props.student) {
            return null
        }

        return (
            <div style={{ padding: '1rem' }}>
                <SubjectList student={this.props.student} />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const students = state.users.students || []
    let student
    if (ownProps.userRole === USER_ROLES.STUDENT) {
        student = students.find(x => x.id === state.eth.selectedAccount)
    }

    return {
        student,
    }
}

export default connect(mapStateToProps)(StudentHome)