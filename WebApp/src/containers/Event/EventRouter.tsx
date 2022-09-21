import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom'
import { getUserRole } from 'utils/userUtils'
import { Details } from './Details/Details'
import { USER_ROLES } from 'utils/constants';
import { ProfessorsRouter } from '../Professors/ProfessorsRouter';
import { Courses } from './Courses/Courses';
import { StudentsRouter } from 'containers/Students/StudentsRouter';
import { Admins } from './Admins/Admins';
import { loadUsersAction } from 'actions/userActions';
import { loadAllCoursesAction } from 'actions/coursesActions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Course } from 'containers/Course/Course';
import { loadEvent } from 'actions/eventActions';
import { ClipSpinner, Spinner } from 'components/Spinner';
import { ContentShell } from 'features/Content';
import { StudentCourses } from 'containers/StudentCourses/StudentCourses';
import { Tree } from 'components/Tree/Tree';
import { adminNavigation, professorNavigation, studentNavigation } from './navigation';
import { ItemType } from 'components/Tree/Item';
import { ProfessorCoursesWrapper } from 'containers/ProfessorCourses/ProfessorCoursesWrapper';

export const EventRouter = () => {
	const dispatch = useDispatch()
	const { path } = useRouteMatch()
	const params: any = useParams()
	const eventId = params.eventId

	const state = useSelector((state: any) => state)
	const userRole = getUserRole(state)

	const [event, setEvent] = useState<any>()

	const loadData = useCallback(
		async () => {
			// FIXME: u EventsRouter napravi stanje za events, Events neka poziva setEvents,
			// a EventRouter neka ima prop events i neka prvo proveri da li event postoji unutar events niza
			const loadedEvent = await loadEvent(eventId)
			await loadUsersAction(eventId, dispatch)
			await loadAllCoursesAction(eventId, dispatch)
			setEvent(loadedEvent)
		},
		[dispatch, eventId]
	)

	useEffect(
		() => {
			loadData()
		},
		[loadData]
	)

	const treeData: ItemType[] = useMemo(
		() => {
			switch (userRole) {
				case USER_ROLES.ADMIN:
					return adminNavigation;
				case USER_ROLES.PROFESSOR:
					return professorNavigation
				case USER_ROLES.STUDENT:
					return studentNavigation
				default:
					return []
			}
		},
		[userRole]
	)

	if (!event) {
		return (
			<Spinner>
				<ClipSpinner size={80} />
			</Spinner>
		)
	}

	return (
		<div style={{ display: 'flex', height: 'calc(100% - 60px)' }}>
			<div style={{ width: '200px', padding: '24px', background: 'rgb(33,37,41)', borderTop: '2px solid var(--content-background)' }}>
				<Tree
					title={event.title}
					data={treeData}
				/>
			</div>
			<div style={{ flex: 1, maxWidth: '1280px' }}>
				{/* INFO: order of Route components is essential */}
				<Switch>
					{userRole === USER_ROLES.ADMIN && <Route path={`${path}/professors`} render={() => <ProfessorsRouter event={event} />}/>}
					{(userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.PROFESSOR) && <Route path={`${path}/students`} render={() => <StudentsRouter event={event} />}/>}
					<Route path={`${path}/courses/read/:courseId`} render={() => <Course event={event} />} />
					{userRole === USER_ROLES.ADMIN && <Route path={`${path}/courses`} render={() => <Courses event={event} />}/>}
					{userRole === USER_ROLES.ADMIN && <Route path={`${path}/admins`} render={() => <Admins event={event} />}/>}

					{userRole === USER_ROLES.PROFESSOR && <Route path={`${path}/professorCourses`} render={() => <ProfessorCoursesWrapper event={event} />} />}

					{userRole === USER_ROLES.STUDENT &&
						<Route
							path={`${path}/studentCourses`}
							render={
								() => (
									<ContentShell title='My Courses'>
										<StudentCourses student={undefined} event={event} />
									</ContentShell>
								)
							}
						/>
					}

					<Route path={`${path}/eventDetails`} render={() => <Details event={event} />}/>
					<Route render={() => <Details event={event} />}/>
				</Switch>
			</div>
		</div>
	)
}
