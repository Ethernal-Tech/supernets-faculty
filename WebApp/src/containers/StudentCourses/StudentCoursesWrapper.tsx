import { ContentShell } from "features/Content"
import { useSelector } from 'react-redux'
import { emptyArray } from 'utils/commonHelper'
import { StudentCourses } from './StudentCourses'

export const StudentCoursesWrapper = ({ event }) => {
	const state = useSelector((state: any) => state)
	const selectedAccount = state.eth.selectedAccount;
    const students = state.users.students || emptyArray
	const student = students.find(x => x.id === selectedAccount)

	return (
		<ContentShell title='My Courses'>
			<StudentCourses
				student={student}
				event={event}
			/>
		</ContentShell>
	)
}
