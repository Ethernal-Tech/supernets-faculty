import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CertificatePage from '../pages/CertificatePage'

import EventList from '../containers/EventList'
import EventPage from '../pages/EventPage'
import LandingPage from '../pages/LandingPage'
import ProfessorDetailsPage from '../pages/ProfessorDetailsPage'
import StudentDetailsPage from '../pages/StudentDetailsPage'
import CourseDetailsPage from '../pages/CourseDetailsPage'
import EditStudentPage from '../pages/EditStudentPage'
import EditProfessorPage from '../pages/EditProfessorPage'

class AppRoutes extends React.Component {
    render() {
        return (
            <Routes>
                <Route path="events" element={<EventList />}/>
                <Route path="event" element={<EventPage />}/>

                <Route path="course" element={<CourseDetailsPage />} />
                <Route path="professor" element={<ProfessorDetailsPage />} />
                <Route path="student" element={<StudentDetailsPage />} />
                <Route path="certificate" element={<CertificatePage />} />

                <Route path="editStudent" element={<EditStudentPage />} />
                <Route path="editProfessor" element={<EditProfessorPage />} />

                {/* if page unsupported, go to home */}
                <Route path="*" element={<LandingPage />}/>
                {/* <Route path="home" element={<HomePage />}/> */}
            </Routes>
        )
    }
}

export default AppRoutes