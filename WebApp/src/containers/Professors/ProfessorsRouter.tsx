import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { ProfessorDetailsPage } from './ProfessorDetailsPage'
import { Professors } from './Professors'

export const ProfessorsRouter = ({ event }) => {
	const { path } = useRouteMatch()

    return (
        <Switch>
            <Route path={`${path}/read/:professorId`} render={() => <ProfessorDetailsPage event={event} />}/>

            <Route render={() => <Professors event={event} />}/>
		</Switch>
    )
}
