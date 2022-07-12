import React from 'react'
import { connect } from 'react-redux'
import { USER_ROLES } from '../utils/constants'
import ProfessorSubjects from './ProfessorSubjects'

class ProfessorHome extends React.Component {
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

export default connect(mapStateToProps)(ProfessorHome)