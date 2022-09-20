import { Switch, Route } from 'react-router-dom'
import { EventsRouter } from 'containers/Events/EventsRouter'
import { LandingPage } from 'pages/LandingPage'

export const ContentRouter = () => {
    return (
        <Switch>
            <Route path="/events" render={() => <EventsRouter />}/>

            <Route render={() => <LandingPage />}/>
        </Switch>
    )
}
