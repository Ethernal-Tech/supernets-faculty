import React from 'react'
import { connect } from 'react-redux'
import { USER_ROLES } from '../utils/constants'
import { Tabs, Tab } from 'react-bootstrap'
import ProfessorCourses from './Professor/ProfessorCourses'
import EventDetails from '../components/EventDetails'

class ProfessorEventHome extends React.Component {

    setSelectedTab = tab => this.setState({ selectedTab: tab })

    state = {
        selectedTab: 'courses',
    }

    render() {
        const { professor, userRole, selectedAccount } = this.props

        if (!professor) {
            return null
        }

        return (
            <Tabs
                activeKey={this.state.selectedTab}
                onSelect={this.setSelectedTab}
                className="mb-3">
                <Tab eventKey="courses" title="My Courses">
                    <ProfessorCourses professor={professor} userRole={userRole} selectedAccount={selectedAccount}/>
                </Tab>
                <Tab eventKey="eventDetails" title="Event Details">
                    <EventDetails userRole={this.props.userRole} />
                </Tab>
            </Tabs>
        )
    }
    
}

const mapStateToProps = (state, ownProps) => {
    const professors = state.users.professors || []
    let professor
    if (ownProps.userRole === USER_ROLES.PROFESSOR) {
        professor = professors.find(x => x.id === state.eth.selectedAccount)
    }

    return {
        professor,
        selectedAccount: state.eth.selectedAccount,
    }
}

export default connect(mapStateToProps)(ProfessorEventHome)