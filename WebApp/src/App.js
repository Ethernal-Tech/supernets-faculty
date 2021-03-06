import React, { useCallback, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'
import { initializeEthAction } from './actions/appActions'
import { loadUsersAction, loadAdminAccountAction } from './actions/userActions'
import { loadAllSubjectsAction } from './actions/subjectActions'

function App() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const initCallback = useCallback(async () => {
        await initializeEthAction(navigate, dispatch)
        await loadAdminAccountAction(dispatch)
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