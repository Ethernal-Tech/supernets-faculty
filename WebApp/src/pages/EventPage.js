import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { AdminEventHome } from 'containers/AdminEventHome'
import { GuestHome } from 'containers/GuestHome'
import { ProfessorEventHome } from 'containers/ProfessorEventHome'
import { StudentHome } from 'containers/StudentHome'

import { USER_ROLES } from 'utils/constants'
import { getUserRole } from 'utils/userUtils'
import { loadUsersAction } from 'actions/userActions'
import { loadAllCoursesAction } from 'actions/coursesActions'

const EventPage = (props) => {

    const getHomeComponent = userRole => {

        switch (userRole) {
            case USER_ROLES.ADMIN:
                return AdminEventHome
            case USER_ROLES.PROFESSOR:
                return ProfessorEventHome
            case USER_ROLES.STUDENT:
                return StudentHome
            default:
                return GuestHome
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        await props.loadUsers(props.selectedEvent.id)
        await props.loadAllCourse(props.selectedEvent.id)
    }

    const { userRole } = props
    const HomeComponent = getHomeComponent(userRole)
    return (
        <HomeComponent userRole={userRole}/>
    )

}

const mapStateToProps = state => {
    const userRole = getUserRole(state)
    return {
        selectedEvent: state.event.selectedEvent,
        userRole,
    }
}

const mapDispatchToProps = dispatch => ({
    loadUsers: (eventId) => loadUsersAction(eventId, dispatch),
    loadAllCourse: (eventId) => loadAllCoursesAction(eventId, dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(EventPage)
