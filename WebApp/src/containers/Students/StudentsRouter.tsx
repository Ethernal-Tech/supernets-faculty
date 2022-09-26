import StudentCertificate from 'containers/StudentCourses/StudentCertificate'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Student } from './Student'
import { Students } from './Students'

export const StudentsRouter = ({ event }) => {
	const { path } = useRouteMatch()

    return (
        <Switch>
            <Route path={`${path}/read/:studentId`} render={() => <Student event={event} />}/>

            <Route render={() => <Students event={event} />}/>
		</Switch>
    )
}
