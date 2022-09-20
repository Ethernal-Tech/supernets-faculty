import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { getUserRole } from 'utils/userUtils'
import { Details } from './Details/Details'
import { USER_ROLES } from 'utils/constants';
import { AdminEventNavbar } from './AdminEventNavbar';
import { ProfessorEventNavbar } from './ProfessorEventNavbar';
import { StudentEventNavbar } from './StudentEventNavbar';
import { getEventAction } from 'actions/eventActions';
import { ProfessorsRouter } from '../Professors/ProfessorsRouter';
import { EventCourses } from './EventCourses/EventCourses';
import { StudentsRouter } from 'containers/Students/StudentsRouter';
import { Admins } from './Admins/Admins';
import { loadUsersAction } from 'actions/userActions';
import { loadAllCoursesAction } from 'actions/coursesActions';
import { useCallback, useEffect, useMemo } from 'react';
import { Courses } from 'containers/Courses/Courses';

export const EventRouter = () => {
	const dispatch = useDispatch()
	const { path } = useRouteMatch()
	const state = useSelector((state: any) => state)
	const userRole = getUserRole(state)

	// FIXME: get event, users and courses stavi zajedno unutar Promise.all i dodaj neki spinner
	const event = useMemo(
		() => getEventAction(),
		[]
	)

	const loadData = useCallback(
		async () => {
			await loadUsersAction(event.id, dispatch)
			await loadAllCoursesAction(event.id, dispatch)
		},
		[dispatch, event.id]
	)

	useEffect(
		() => {
			loadData()
		},
		[loadData]
	)

	return (
		<div style={{ display: 'flex', height: 'calc(100% - 60px)' }}>
			<div style={{ width: '250px', padding: '24px', background: '#4d4d4d' }}>
				{userRole === USER_ROLES.ADMIN && <AdminEventNavbar event={event} />}
				{userRole === USER_ROLES.PROFESSOR && <ProfessorEventNavbar />}
				{userRole === USER_ROLES.STUDENT && <StudentEventNavbar />}
			</div>
			<div style={{ flex: 1, maxWidth: '1280px' }}>
				<Switch>
					{userRole === USER_ROLES.ADMIN && <Route path={`${path}/professors`} render={() => <ProfessorsRouter event={event} />}/>}
					{userRole === USER_ROLES.ADMIN && <Route path={`${path}/courses/read/:courseId`} render={() => <Courses event={event} />}/>}
					{userRole === USER_ROLES.ADMIN && <Route path={`${path}/courses`} render={() => <EventCourses event={event} />}/>}
					{userRole === USER_ROLES.ADMIN && <Route path={`${path}/students`} render={() => <StudentsRouter event={event} />}/>}
					{userRole === USER_ROLES.ADMIN && <Route path={`${path}/admins`} render={() => <Admins event={event} />}/>}

					<Route path={`${path}/eventDetails`} render={() => <Details event={event} />}/>
					<Route render={() => <Details event={event} />}/>
				</Switch>
			</div>
		</div>
	)
}
