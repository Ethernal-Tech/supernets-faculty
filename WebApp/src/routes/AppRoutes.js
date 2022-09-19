import { Switch, Route } from 'react-router-dom'
import { EventList } from 'containers/EventList/EventList'
import LandingPage from 'pages/LandingPage'
import ProfessorDetailsPage from 'pages/ProfessorDetailsPage'
import StudentDetailsPage from 'pages/StudentDetailsPage'
import { CourseDetailsPage } from 'pages/CourseDetailsPage'
import CertificatePage from 'pages/CertificatePage'
import { ProfessorList } from 'containers/Admin/Proffesors/ProfessorList'
import { StudentList } from 'containers/Admin/Students/StudentList'
import { AdminList } from 'containers/Admin/Admin/AdminList';
import { ProfessorCourses } from 'containers/Professor/ProfessorCourses'
import { EventCourses } from 'containers/Admin/Courses/EventCourses'
import EventDetails from 'containers/EventDetails'

const AppRoutes = () => {
    return (
        <Switch>
            <Route path="/events" render={() => <EventList />}/>
            <Route path="/course" render={() => <CourseDetailsPage />} />
            <Route path="/professor" render={() => <ProfessorDetailsPage />} />
            <Route path="/student" render={() => <StudentDetailsPage />} />
            <Route path="/certificate" render={() => <CertificatePage />} />

            <Route path="/eventDetails" render={() => <EventDetails />}/>
            <Route path="/professors" render={() => <ProfessorList />}/>
            <Route path="/courses" render={() => <EventCourses />}/>
            <Route path="/students" render={() => <StudentList />} />
            <Route path="/admins" render={() => <AdminList />} />
            <Route path="/profCourses" render={() => <ProfessorCourses />} />

            {/* if page unsupported, go to home */}
            <Route render={() => <LandingPage />}/>
            {/* <Route path="home" render={() => <HomePage />}/> */}
        </Switch>
    )
}

export default AppRoutes
