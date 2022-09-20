import { createSlice } from '@reduxjs/toolkit'

export const certificatesReducer = createSlice({
    name: 'certificates',
    initialState: {
        studentCertificates: {},
    },
    reducers: {
        setStudentCertificates: (state, action) => {
            state.studentCertificates = {
                ...state.studentCertificates,
                [action.payload.studentId]: action.payload.certificate
            }
        },
    }
})

// Action creators are generated for each case reducer function
export const { setStudentCertificates } = certificatesReducer.actions

export default certificatesReducer.reducer