import { EventRouter } from 'containers/Event/EventRouter'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Events } from './Events'

export const EventsRouter = () => {
	const { path } = useRouteMatch()

    return (
        <Switch>
            <Route path={`${path}/read/:eventId`} render={() => <EventRouter />}/>
            <Route render={() => <Events />}/>
        </Switch>
    )
}
