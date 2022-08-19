import React from 'react'
import { connect } from 'react-redux'
import CourseList from '../containers/Student/CourseList'
import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'
import withRouter from '../utils/withRouter'

class StudentDetailsPage extends React.Component {
    render() {
        const { student, stud, userRole } = this.props
        if (!student) {
            return null
        }

        return (
            <div style={{ padding: '1rem' }}>
                <CourseList student={student} userRole={userRole} studParam={stud}/>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const userRole = getUserRole(state)
    const students = state.users.students || []
    let student
    if (ownProps.stud) {
        const studentInd = ownProps.stud ? parseInt(ownProps.stud) : -1
        student = studentInd >= 0 && students.length > studentInd ? students[studentInd] : undefined
    }
    else if (userRole === USER_ROLES.STUDENT) {
        student = students.find(x => x.id === state.eth.selectedAccount)
    }

    return {
        userRole,
        student,
    }
}

export default withRouter(connect(mapStateToProps)(StudentDetailsPage))