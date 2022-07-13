import React from 'react'
import { connect } from 'react-redux'

import AdminHome from '../containers/AdminHome'
import GuestHome from '../containers/GuestHome'
import ProfessorHome from '../containers/ProfessorHome'
import StudentHome from '../containers/StudentHome'

import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'

class HomePage extends React.Component {
    getHomeComponent = userRole => {
        
        switch (userRole) {
            case USER_ROLES.ADMIN:
                return AdminHome
            case USER_ROLES.PROFESSOR:
                return ProfessorHome
            case USER_ROLES.STUDENT:
                return StudentHome
            default:
                return GuestHome
        }
    }

    render() {
        const { userRole } = this.props
        const HomeComponent = this.getHomeComponent(userRole)
        return (
            <HomeComponent
                userRole={userRole}
            />
        )
    }
}


const mapStateToProps = state => {
    const userRole = getUserRole(state)
    return {
        userRole,
    }
}

export default connect(mapStateToProps)(HomePage)