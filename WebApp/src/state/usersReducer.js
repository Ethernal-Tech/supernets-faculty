import { createSlice } from '@reduxjs/toolkit'

export const usersReducer = createSlice({
    name: 'users',
    initialState: {
        professors: undefined,
        students: undefined,
        admins: undefined
    },
    reducers: {
        setProfessors: (state, action) => {
            state.professors = action.payload
        },
        setStudents: (state, action) => {
            state.students = action.payload
        },
        setAdmins: (state, action) => {
            state.admins = action.payload
        },
        setUsers: (state, action) => {
            state.professors = action.payload.professors
            state.students = action.payload.students
            state.admins = action.payload.admins
        }
    },
})

// Action creators are generated for each case reducer function
export const { setProfessors, setStudents, setAdmins, setUsers } = usersReducer.actions

export default usersReducer.reducer