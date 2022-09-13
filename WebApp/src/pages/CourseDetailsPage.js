import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getUserRole, isEventAdmin } from '../utils/userUtils'
import withRouter from 'utils/withRouter'

import CourseDetailsComponent from 'components/CourseDetailsComponent'
import { CourseStudents } from 'containers/CourseStudents'
import { EnrollStudentsList } from 'containers/Admin/EnrollStudentsList'
import { GradeStudentsList } from 'containers/Admin/GradeStudentsList'

class CourseDetailsPage extends React.Component {
    state = {
        selectedTab: 'couseDetails',
    }

    setSelectedTab = tab => this.setState({ selectedTab: tab })

    render() {
        const { course, userRole, selectedAccount } = this.props

        if (!course) {
            return null
        }
        return (
            <Tabs
                activeKey={this.state.selectedTab}
                onSelect={this.setSelectedTab}
                className="mb-3">
                <Tab eventKey="couseDetails" title="Course Details">
                    <CourseDetailsComponent course={course} />
                </Tab>
                <Tab eventKey="enrolled" title="Students on course">
                    <CourseStudents courseId={course.id} userRole={userRole} selectedAccount={selectedAccount}/>
                </Tab>
                {
                    this.props.isAdmin &&
                    <Tab eventKey="notEnrolled" title="Enroll students">
                        <EnrollStudentsList courseId={course.id} selectedAccount={selectedAccount}/>
                    </Tab>
                }
                {
                    this.props.isAdmin &&
                    <Tab eventKey="notGraded" title="Grade students">
                        <GradeStudentsList course={course} selectedAccount={selectedAccount}/>
                    </Tab>
                }
            </Tabs>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const userRole = getUserRole(state)
    const courses = state.courses.allCourses || []
    const course = ownProps.courseId ? courses.find(x => x.id === ownProps.courseId) : undefined
    const isAdmin = isEventAdmin(state)
    return {
        userRole,
        course,
        selectedAccount: state.eth.selectedAccount,
        isAdmin,
    }
}

export default withRouter(connect(mapStateToProps)(CourseDetailsPage))
