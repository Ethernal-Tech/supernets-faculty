import React from 'react'
import { connect } from 'react-redux'
import SubjectStudents from '../containers/SubjectStudents'
import { getUserRole } from '../utils/userUtils'
import withRouter from '../utils/withRouter'

class SubjectDetailsPage extends React.Component {
    render() {
        const { subject, userRole, selectedAccount } = this.props

        if (!subject) {
            return null
        }
        return (
            <SubjectStudents subject={subject} userRole={userRole} selectedAccount={selectedAccount}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const userRole = getUserRole(state)
    const subjects = state.subjects.allSubjects || []
    const subject = ownProps.subjId ? subjects.find(x => x.id === ownProps.subjId) : undefined
    return {
        userRole,
        subject,
        selectedAccount: state.eth.selectedAccount,
    }
}

export default withRouter(connect(mapStateToProps)(SubjectDetailsPage))