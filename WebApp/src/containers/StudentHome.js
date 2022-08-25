import React from 'react'
import { connect } from 'react-redux'
import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'
import { Tabs, Tab } from 'react-bootstrap'
import CourseList from './Student/CourseList'
import EventDetails from '../components/EventDetails'

class StudentHome extends React.Component {

    setSelectedTab = tab => this.setState({ selectedTab: tab })

    state = {
        selectedTab: 'courses',
    }

    render() {
        const { student, userRole } = this.props
        if (!student) {
            return null
        }

        return (
            <Tabs
                activeKey={this.state.selectedTab}
                onSelect={this.setSelectedTab}
                className="mb-3">
                <Tab eventKey="courses" title="My Courses">
                    <CourseList student={student} userRole={userRole}/>
                </Tab>
                <Tab eventKey="eventDetails" title="Event Details">
                    <EventDetails userRole={this.props.userRole} />
                </Tab>
            </Tabs>
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