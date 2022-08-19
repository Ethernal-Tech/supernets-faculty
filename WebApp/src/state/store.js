import { configureStore } from '@reduxjs/toolkit'
import ethReducer from './ethReducer'
import eventReducer from './eventReducer'
import coursesReducer from './coursesReducer'
import usersReducer from './usersReducer'

export default configureStore({
    reducer: {
        eth: ethReducer,
        users: usersReducer,
        courses: coursesReducer,
        event: eventReducer,
    },
})