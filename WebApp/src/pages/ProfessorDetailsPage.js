import React from 'react'
import { connect } from 'react-redux'
import ProfessorSubjects from '../containers/ProfessorSubjects'
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
            <ProfessorSubjects professor={professor} userRole={userRole} selectedAccount={selectedAccount}/>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const userRole = getUserRole(state)
    const professors = state.users.professors || []
    let professor
    if (ownProps.prof) {
        const professorInd = ownProps.prof ? parseInt(ownProps.prof) : -1
        professor = professorInd >= 0 && professors.length > professorInd ? professors[professorInd] : undefined
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