import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CertificatePage from '../pages/CertificatePage'

import HomePage from '../pages/HomePage'
import LandingPage from '../pages/LandingPage'
import ProfessorDetailsPage from '../pages/ProfessorDetailsPage'
import StudentDetailsPage from '../pages/StudentDetailsPage'
import SubjectDetailsPage from '../pages/SubjectDetailsPage'

class AppRoutes extends React.Component {
    render() {
        return (
            <Routes>
                <Route path="certificate" element={<CertificatePage />} />
                <Route path="professor" element={<ProfessorDetailsPage />} />
                <Route path="student" element={<StudentDetailsPage />} />
                <Route path="subject" element={<SubjectDetailsPage />} />

                {/* if page unsupported, go to home */}
                <Route path="*" element={<LandingPage />}/>
                <Route path="home" element={<HomePage />}/>
            </Routes>
        )
    }
}

export default AppRoutes