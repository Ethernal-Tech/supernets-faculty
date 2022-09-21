import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Professor } from './Professor'
import { Professors } from './Professors'

export const ProfessorsRouter = ({ event }) => {
	const { path } = useRouteMatch()

    return (
        <Switch>
            <Route path={`${path}/read/:professorId`} render={() => <Professor event={event} />}/>

            <Route render={() => <Professors event={event} />}/>
		</Switch>
    )
}
