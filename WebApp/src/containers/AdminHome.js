import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'

import ProfessorList from './Admin/ProfessorList'
import StudentList from './Admin/StudentList'

class AdminHome extends React.Component {
    state = {
        selectedTab: 'professors',
    }

    setSelectedTab = tab => this.setState({ selectedTab: tab })

    render() {
        return (
            <Tabs
                activeKey={this.state.selectedTab}
                onSelect={this.setSelectedTab}
                className="mb-3"
            >
                <Tab eventKey="professors" title="Professors">
                    <ProfessorList userRole={this.props.userRole} />
                </Tab>
                <Tab eventKey="students" title="Students">
                    <StudentList userRole={this.props.userRole} />
                </Tab>
            </Tabs>
        )
    }
}

export default AdminHome