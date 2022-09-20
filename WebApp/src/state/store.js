import { configureStore } from '@reduxjs/toolkit'
import ethReducer from './ethReducer'
import coursesReducer from './coursesReducer'
import usersReducer from './usersReducer'
import certificatesReducer from './certificatesReducer'

export default configureStore({
    reducer: {
        eth: ethReducer,
        users: usersReducer,
        courses: coursesReducer,
        certificates: certificatesReducer
    },
})
