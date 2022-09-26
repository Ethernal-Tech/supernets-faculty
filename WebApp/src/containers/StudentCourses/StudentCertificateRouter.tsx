import { Switch, Route, useRouteMatch } from 'react-router-dom'
import StudentCertificate from './StudentCertificate'

export const StudentCertificateRouter = () => {
	const { path } = useRouteMatch()

    return (
        <Switch>
            <Route path={`${path}/:studentId`} render={() => <StudentCertificate />}/>
		</Switch>
    )
}
