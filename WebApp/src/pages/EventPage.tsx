import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AdminEventHome } from 'containers/AdminEventHome'
import { GuestHome } from 'containers/GuestHome'
import { ProfessorEventHome } from 'containers/ProfessorEventHome'
import { StudentHome } from 'containers/StudentHome'
import { USER_ROLES } from 'utils/constants'
import { getUserRole } from 'utils/userUtils'
import { loadUsersAction } from 'actions/userActions'
import { loadAllCoursesAction } from 'actions/coursesActions'

export const EventPage = () => {
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const userRole = getUserRole(state)
	const selectedEvent = state.event.selectedEvent;

    const HomeComponent = useMemo(
		() => {
	        switch (userRole) {
	            case USER_ROLES.ADMIN:
	                return AdminEventHome
	            case USER_ROLES.PROFESSOR:
	                return ProfessorEventHome
	            case USER_ROLES.STUDENT:
	                return StudentHome
	            default:
	                return GuestHome
	        }
		},
		[userRole]
	)

    const loadData = useCallback(
		async () => {
			// TODO: Promise.all maybe?
			await loadUsersAction(selectedEvent.id, dispatch);
			await loadAllCoursesAction(selectedEvent.id, dispatch);
		},
		[selectedEvent.id, dispatch]
	)

    useEffect(
		() => {
	        loadData()
		},
		[loadData]
	)

    return (
        <HomeComponent userRole={userRole}/>
    )

}
