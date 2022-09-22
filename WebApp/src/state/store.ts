import { configureStore } from '@reduxjs/toolkit'
import ethReducer from './ethReducer'
import coursesReducer from './coursesReducer'
import usersReducer from './usersReducer'
import certificatesReducer from './certificatesReducer'

const store = configureStore({
	reducer: {
		eth: ethReducer,
		users: usersReducer,
		courses: coursesReducer,
		certificates: certificatesReducer
	}
})

export default store

export type RootState = ReturnType<typeof store.getState>
