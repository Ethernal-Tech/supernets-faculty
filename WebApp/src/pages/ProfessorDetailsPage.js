import React from 'react'
import { connect } from 'react-redux'
import { ProfessorCourses } from 'containers/Professor/ProfessorCourses'
import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'
import withRouter from '../utils/withRouter'

class ProfessorDetailsPage extends React.Component {
    render() {
        const { professor, userRole, selectedAccount } = this.props

        if (!professor) {
            return null
        }

        return (
            <div style={{ padding: '1rem' }}>
                <h2>Name: {this.props.professor.firstName} {this.props.professor.lastName}</h2>
                <h3>From: {this.props.professor.country}</h3>
                <h3>Expertise: {this.props.professor.expertise}</h3>
                <br/>
                <ProfessorCourses professor={professor} userRole={userRole} selectedAccount={selectedAccount}/>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const userRole = getUserRole(state)
    const professors = state.users.professors || []
    let professor
    if (ownProps.prof) {
        professor = professors.find(prof => prof.id === ownProps.prof)
    }
    else if (userRole === USER_ROLES.PROFESSOR) {
        professor = professors.find(x => x.id === state.eth.selectedAccount)
    }

    return {
        userRole,
        professor,
        selectedAccount: state.eth.selectedAccount,
    }
}

export default withRouter(connect(mapStateToProps)(ProfessorDetailsPage))
