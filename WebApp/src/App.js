import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Navbar from 'containers/Navbar'
import AppRoutes from 'routes/AppRoutes'
import { initializeEthAction } from 'actions/appActions'
import { loadAdminAccountAction } from 'actions/userActions'
import { Container } from 'react-bootstrap'
import AdminEventNavbar from 'containers/AdminEventNavbar'
import ProfessorEventNavbar from 'containers/ProfessorEventNavbar'
import StudentEventNavbar from 'containers/StudentEventNavbar'
import { connect } from 'react-redux'
import { getUserRole } from 'utils/userUtils'
import { USER_ROLES } from 'utils/constants'

function App(props) {
    const dispatch = useDispatch()
    const history = useHistory()

    const initCallback = useCallback(
		async () => {
	        await initializeEthAction(history, dispatch)
	        await loadAdminAccountAction(dispatch)
	        // eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[dispatch, history]
	)

    useEffect(() => {
        initCallback()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Navbar />
            <Container>
                {props.selectedEvent && props.userRole === USER_ROLES.ADMIN && <AdminEventNavbar />}
                {props.selectedEvent && props.userRole === USER_ROLES.PROFESSOR && <ProfessorEventNavbar />}
                {props.selectedEvent && props.userRole === USER_ROLES.STUDENT && <StudentEventNavbar />}
                <AppRoutes/>
            </Container>
        </>
    )
}

const mapStateToProps = state => {
    const userRole = getUserRole(state)

    return {
        selectedEvent: state.event.selectedEvent,
        userRole
    }
}

export default connect(mapStateToProps)(App)
