import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'

import EventDetails from '../components/EventDetails'
import ProfessorList from './Admin/ProfessorList'
import StudentList from './Admin/StudentList'
import AdminsList from './Admin/AdminsList'
class AdminEventHome extends React.Component {
    state = {
        selectedTab: 'eventDetails',
    }

    setSelectedTab = tab => this.setState({ selectedTab: tab })

    render() {
        return (
            <Tabs
                activeKey={this.state.selectedTab}
                onSelect={this.setSelectedTab}
                className="mb-3">
                <Tab eventKey="eventDetails" title="Event Details">
                    <EventDetails userRole={this.props.userRole} />
                </Tab>
                <Tab eventKey="professors" title="Professors">
                    <ProfessorList userRole={this.props.userRole} />
                </Tab>
                <Tab eventKey="students" title="Students">
                    <StudentList userRole={this.props.userRole} />
                </Tab>
                <Tab eventKey="admins" title="Event Admins">
                    <AdminsList />
                </Tab>
            </Tabs>
        )
    }
}

export default AdminEventHome