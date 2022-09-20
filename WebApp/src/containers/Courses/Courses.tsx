import { Tabs, TabType } from 'components/Tabs'
import { useSelector } from 'react-redux'
import { isEventAdmin } from 'utils/userUtils'
import { emptyArray } from 'utils/commonHelper'
import { CourseDetails } from './CourseDetails'
import { CourseStudents } from './CourseStudents'
import { EnrollStudentsList } from './EnrollStudentsList'
import { GradeStudentsList } from './GradeStudentsList'
import { useParams } from 'react-router-dom';
import { ContentShell } from 'features/Content'

const tabs: TabType[] = [
	{
		id: 'courseDetails',
		title: 'Course Details',
		route: 'courseDetails',
		component: CourseDetails,
	},
	{
		id: 'enrolled',
		title: 'Students on course',
		route: 'enrolled',
		component: CourseStudents
	}
];

const adminTabs: TabType[] = [
	...tabs,
	{
		id: 'notEnrolled',
		title: 'Enroll students',
		route: 'notEnrolled',
		component: EnrollStudentsList,
	},
	{
		id: 'notGraded',
		title: 'Grade students',
		route: 'notGraded',
		component: GradeStudentsList
	}
]

export type CoursesTabProps = {
	course: any
	selectedAccount: any
	event: any
}

export const Courses = ({ event }) => {
	const params: any = useParams()
	const courseId = params.courseId

	const state = useSelector((state: any) => state)
    const courses = state.courses.allCourses || emptyArray
    const course = courseId ? courses.find(x => x.id === courseId) : undefined
	const isAdmin = isEventAdmin(state)
	const selectedAccount = state.eth.selectedAccount

    if (!course) {
        return <></>
	}

    return (
		<ContentShell title={course.title}>
			<Tabs
				tabs={isAdmin ? adminTabs : tabs}
				tabComponentProps={{
					course,
					event,
					selectedAccount
				} as CoursesTabProps}
			/>
		</ContentShell>
    )
}
