import { createSlice } from '@reduxjs/toolkit'

export const coursesReducer = createSlice({
    name: 'courses',
    initialState: {
        allCourses: [],
        coursesByProfessorAddr: {},
        gradesByStudentByCourse: {},
        gradesByCourseByStudent: {},
        studentCourses: {},
    },
    reducers: {
        setAllCourses: (state, action) => {
            state.allCourses = action.payload
        },
        setCoursesForProfessorAddr: (state, action) => {
            state.coursesByProfessorAddr = {
                ...state.coursesByProfessorAddr,
                [action.payload.professorAddr]: action.payload.courses,
            }
        },
        setStudentGrades: (state, action) => {
            const { gradesByCourseByStudent, gradesByStudentByCourse} = action.payload
            state.gradesByStudentByCourse = gradesByStudentByCourse
            state.gradesByCourseByStudent = gradesByCourseByStudent
        },
        setStudentCourses: (state, action) => {
            state.studentCourses = {
                ...state.studentCourses,
                [action.payload.studentId]: action.payload.courses
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { setAllCourses, setCoursesForProfessorAddr, setStudentGrades, setStudentCourses } = coursesReducer.actions

export default coursesReducer.reducer