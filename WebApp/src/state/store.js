import { configureStore } from '@reduxjs/toolkit'
import ethReducer from './ethReducer'
import subjectsReducer from './subjectsReducer'
import usersReducer from './usersReducer'

export default configureStore({
    reducer: {
        eth: ethReducer,
        users: usersReducer,
        subjects: subjectsReducer,
    },
})