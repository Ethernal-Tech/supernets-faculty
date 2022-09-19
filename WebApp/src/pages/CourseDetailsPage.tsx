import { Tabs, TabType } from 'components/Tabs'
import { useSelector } from 'react-redux'
import { isEventAdmin } from '../utils/userUtils'
import CourseDetailsComponent from 'components/CourseDetailsComponent'
import { CourseStudents } from 'containers/CourseStudents'
import { EnrollStudentsList } from 'containers/Admin/EnrollStudentsList'
import { GradeStudentsList } from 'containers/Admin/GradeStudentsList'
import { emptyArray } from 'utils/commonHelper'
import { useQuery } from 'features/Router/useQuery'

const tabs: TabType[] = [
	{
		id: 'courseDetails',
		title: 'Course Details',
		route: 'courseDetails',
		component: CourseDetailsComponent,
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

export type TabProps = {
	course: any
	selectedAccount: any
}

export const CourseDetailsPage = () => {
	const query = useQuery();
	const courseId = query.courseId;
	const state = useSelector((state: any) => state)
    const courses = state.courses.allCourses || emptyArray
    const course = courseId ? courses.find(x => x.id === courseId) : undefined
	const isAdmin = isEventAdmin(state)
	const selectedAccount = state.eth.selectedAccount

    if (!course) {
        return <></>
	}

    return (
		<Tabs
			tabs={isAdmin ? adminTabs : tabs}
			tabComponentProps={{
				course,
				selectedAccount
			} as TabProps}
		/>
    )
}
