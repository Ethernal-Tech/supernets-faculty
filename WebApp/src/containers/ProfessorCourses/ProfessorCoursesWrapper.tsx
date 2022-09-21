import path from 'path'
import { ContentShell } from "features/Content"
import { ProfessorCourses } from "./ProfessorCourses"
import { useSelector } from 'react-redux'
import { emptyArray } from 'utils/commonHelper'

export const ProfessorCoursesWrapper = ({ event }) => {
	const state = useSelector((state: any) => state)
	const professors = state.users.professors || emptyArray
	const selectedAccount = state.eth.selectedAccount
	const professor = professors.find(x => x.id === selectedAccount)

	return (
		<ContentShell title='My Courses'>
			<ProfessorCourses
				professor={professor}
				event={event}
				viewCourseRoutePrefix={path.join('./', 'courses', 'read')}
			/>
		</ContentShell>
	)
}
