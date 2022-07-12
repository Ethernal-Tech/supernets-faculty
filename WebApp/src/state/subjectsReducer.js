import { createSlice } from '@reduxjs/toolkit'

export const subjectsReducer = createSlice({
    name: 'subjects',
    initialState: {
        allSubjects: [],
        subjectsByProfessorAddr: {},
    },
    reducers: {
        setAllSubjects: (state, action) => {
            state.allSubjects = action.payload
        },
        setSubjectsForProfessorAddr: (state, action) => {
            state.subjectsByProfessorAddr = {
                ...state.subjectsByProfessorAddr,
                [action.payload.professorAddr]: action.payload.subjects,
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { setAllSubjects, setSubjectsForProfessorAddr } = subjectsReducer.actions

export default subjectsReducer.reducer