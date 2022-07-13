import React from 'react'
import { connect } from 'react-redux'
import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'
import SubjectList from './Student/SubjectList'

class StudentHome extends React.Component {
    render() {
        const { student, userRole } = this.props
        if (!student) {
            return null
        }

        return (
            <div style={{ padding: '1rem' }}>
                <SubjectList student={student} userRole={userRole}/>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const userRole = getUserRole(state)
    const students = state.users.students || []
    let student
    if (ownProps.userRole === USER_ROLES.STUDENT) {
        student = students.find(x => x.id === state.eth.selectedAccount)
    }

    return {
        userRole,
        student,
    }
}

export default connect(mapStateToProps)(StudentHome)