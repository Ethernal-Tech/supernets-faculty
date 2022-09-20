import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { initializeEthAction } from 'actions/appActions'
import { loadAdminAccountAction } from 'actions/userActions'
import Navbar from 'containers/Navbar'
import { ContentRouter } from 'features/Content'

export const App = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const initCallback = useCallback(
		async () => {
	        await initializeEthAction(history, dispatch)
	        await loadAdminAccountAction(dispatch)
		},
		[dispatch, history]
	)

    useEffect(
		() => {
	        initCallback()
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	)

    return (
        <>
            <Navbar />
			<ContentRouter />
        </>
    )
}
