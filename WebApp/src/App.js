import React, { useCallback, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'
import { initializeEthAction } from './actions/appActions'
import { loadAdminAccountAction } from './actions/userActions'

function App() {
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
            <AppRoutes/>
        </>
    )
}

export default App