import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { StudentDetailsPage } from './StudentDetailsPage'
import { Students } from './Students'

export const StudentsRouter = ({ event }) => {
	const { path } = useRouteMatch()

    return (
        <Switch>
            <Route path={`${path}/read/:studentId`} render={() => <StudentDetailsPage event={event} />}/>

            <Route render={() => <Students event={event} />}/>
		</Switch>
    )
}
