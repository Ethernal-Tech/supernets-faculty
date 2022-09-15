import { useCallback, useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { isEventAdmin } from '../utils/userUtils'
import CourseDetailsComponent from 'components/CourseDetailsComponent'
import { CourseStudents } from 'containers/CourseStudents'
import { EnrollStudentsList } from 'containers/Admin/EnrollStudentsList'
import { GradeStudentsList } from 'containers/Admin/GradeStudentsList'
import { emptyArray } from 'utils/commonHelper'
import { useQuery } from 'features/Router/useQuery'

export const CourseDetailsPage = () => {
	const query = useQuery();
	const courseId = query.courseId;
	const state = useSelector((state: any) => state)
    const courses = state.courses.allCourses || emptyArray
    const course = courseId ? courses.find(x => x.id === courseId) : undefined
	const isAdmin = isEventAdmin(state)
	const selectedAccount = state.eth.selectedAccount
	const [selectedTab, setSelectedTab] = useState('couseDetails')

	const setSelectedCallback = useCallback(
		(eventKey: string | null) => {
			setSelectedTab(eventKey || '')
		},
		[]
	)

    if (!course) {
        return <></>
	}

    return (
        <Tabs
            activeKey={selectedTab}
            onSelect={setSelectedCallback}
            className="mb-3">
            <Tab eventKey="couseDetails" title="Course Details">
                <CourseDetailsComponent course={course} />
            </Tab>
            <Tab eventKey="enrolled" title="Students on course">
                <CourseStudents courseId={course.id} selectedAccount={selectedAccount}/>
            </Tab>
            {isAdmin &&
                <Tab eventKey="notEnrolled" title="Enroll students">
                    <EnrollStudentsList courseId={course.id} selectedAccount={selectedAccount}/>
                </Tab>
            }
            { isAdmin &&
                <Tab eventKey="notGraded" title="Grade students">
                    <GradeStudentsList course={course} selectedAccount={selectedAccount}/>
                </Tab>
            }
        </Tabs>
    )
}
