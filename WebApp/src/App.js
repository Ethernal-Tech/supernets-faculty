import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'
import { initializeEthAction } from './actions/appActions'
import { loadAdminAccountAction } from './actions/userActions'
import { Container } from 'react-bootstrap'
import AdminEventNavbar from './components/AdminEventNavbar'
import ProfessorEventNavbar from './components/ProfessorEventNavbar'
import StudentEventNavbar from './components/StudentEventNavbar'
import { connect } from 'react-redux'
import { getUserRole } from 'utils/userUtils'
import { USER_ROLES } from 'utils/constants'

function App(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const initCallback = useCallback(async () => {
        await initializeEthAction(navigate, dispatch)
        await loadAdminAccountAction(dispatch)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
