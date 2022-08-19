import React from 'react'
import { connect } from 'react-redux'
import CourseStudents from '../containers/CourseStudents'
import { getUserRole } from '../utils/userUtils'
import withRouter from '../utils/withRouter'

class CourseDetailsPage extends React.Component {
    render() {
        const { course, userRole, selectedAccount } = this.props

        if (!course) {
            return null
        }
        return (
            <CourseStudents course={course} userRole={userRole} selectedAccount={selectedAccount}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const userRole = getUserRole(state)
    const courses = state.courses.allCourses || []
    const course = ownProps.courseId ? courses.find(x => x.id === ownProps.courseId) : undefined
    return {
        userRole,
        course,
        selectedAccount: state.eth.selectedAccount,
    }
}

export default withRouter(connect(mapStateToProps)(CourseDetailsPage))