import { createSlice } from '@reduxjs/toolkit'

export const subjectsReducer = createSlice({
    name: 'subjects',
    initialState: {
        allSubjects: [],
        subjectsByProfessorAddr: {},
        gradesByStudentBySubject: {},
        gradesBySubjectByStudent: {},
        studentSubjects: {},
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
        setStudentGrades: (state, action) => {
            const { gradesBySubjectByStudent, gradesByStudentBySubject} = action.payload
            state.gradesByStudentBySubject = gradesByStudentBySubject
            state.gradesBySubjectByStudent = gradesBySubjectByStudent
        },
        setStudentSubjects: (state, action) => {
            state.studentSubjects = {
                ...state.studentSubjects,
                [action.payload.studentId]: action.payload.subjects
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { setAllSubjects, setSubjectsForProfessorAddr, setStudentGrades, setStudentSubjects } = subjectsReducer.actions

export default subjectsReducer.reducer