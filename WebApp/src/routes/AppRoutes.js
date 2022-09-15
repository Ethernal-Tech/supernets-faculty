import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CertificatePage from '../pages/CertificatePage'

import { EventList } from 'containers/EventList/EventList'
import LandingPage from '../pages/LandingPage'
import ProfessorDetailsPage from '../pages/ProfessorDetailsPage'
import StudentDetailsPage from '../pages/StudentDetailsPage'
import CourseDetailsPage from '../pages/CourseDetailsPage'
import EventDetails from '../components/EventDetails'
import { ProfessorList } from '../containers/Admin/Proffesors/ProfessorList'
import { StudentList } from '../containers/Admin/Students/StudentList'
import { AdminList } from '../containers/Admin/Admin/AdminList';
import { ProfessorCourses } from '../containers/Professor/ProfessorCourses'

class AppRoutes extends React.Component {
    render() {
        return (
            <Routes>
                <Route path="events" element={<EventList />}/>
                <Route path="course" element={<CourseDetailsPage />} />
                <Route path="professor" element={<ProfessorDetailsPage />} />
                <Route path="student" element={<StudentDetailsPage />} />
                <Route path="certificate" element={<CertificatePage />} />

                <Route path="eventDetails" element={<EventDetails/>}/>
                <Route path="professors" element={<ProfessorList />}/>
                <Route path="students" element={<StudentList />} />
                <Route path="admins" element={<AdminList />} />
                <Route path="profCourses" element={<ProfessorCourses />} />

                {/* if page unsupported, go to home */}
                <Route path="*" element={<LandingPage />}/>
                {/* <Route path="home" element={<HomePage />}/> */}
            </Routes>
        )
    }
}

export default AppRoutes
