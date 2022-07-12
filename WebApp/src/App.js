import React, { useCallback, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'
import { initializeEthAction } from './actions/appActions'
import { loadUsersAction } from './actions/userActions'
import { loadAllSubjectsAction } from './actions/subjectActions'

function App() {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const initCallback = useCallback(async () => {
        await initializeEthAction(location, navigate, dispatch)
        await loadUsersAction(dispatch)
        await loadAllSubjectsAction(dispatch)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        initCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Navbar />
            <AppRoutes/>
        </>
    )
}

export default App