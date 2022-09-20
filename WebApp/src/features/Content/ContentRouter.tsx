import { Switch, Route } from 'react-router-dom'
import { EventsRouter } from 'containers/Events/EventsRouter'
import { LandingPage } from 'pages/LandingPage'
// import { CourseDetailsPage } from 'pages/CourseDetailsPage'
// import CertificatePage from 'pages/CertificatePage'
// import { ProfessorCourses } from 'containers/Professor/ProfessorCourses'

export const ContentRouter = () => {
    return (
        <Switch>
            <Route path="/events" render={() => <EventsRouter />}/>
            {/* <Route path="/course" render={() => <CourseDetailsPage />} />
            <Route path="/certificate" render={() => <CertificatePage />} />

            <Route path="/profCourses" render={() => <ProfessorCourses />} /> */}

            {/* if page unsupported, go to home */}
            <Route render={() => <LandingPage />}/>
            {/* <Route path="home" render={() => <HomePage />}/> */}
        </Switch>
    )
}
