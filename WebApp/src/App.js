import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'
import { initializeEthAction } from './actions/appActions'
import { loadAdminAccountAction } from './actions/userActions'
import { Container } from 'react-bootstrap'

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
            <Container>
                <AppRoutes/>
            </Container>
        </>
    )
}

export default App
