import { configureStore } from '@reduxjs/toolkit'
import ethReducer from './ethReducer'
import usersReducer from './usersReducer'

export default configureStore({
    reducer: {
        eth: ethReducer,
        users: usersReducer,
    },
})