import { createSlice } from '@reduxjs/toolkit'

export const usersReducer = createSlice({
    name: 'users',
    initialState: {
        professors: undefined,
        students: undefined,
    },
    reducers: {
        setProfessors: (state, action) => {
            state.professors = action.payload
        },
        setStudents: (state, action) => {
            state.students = action.payload
        },
        setUsers: (state, action) => {
            state.professors = action.payload.professors
            state.students = action.payload.students
        },
    },
})

// Action creators are generated for each case reducer function
export const { setProfessors, setStudents, setUsers } = usersReducer.actions

export default usersReducer.reducer