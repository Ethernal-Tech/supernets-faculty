import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { USER_ROLES } from '../utils/constants'
import { getUserRole } from '../utils/userUtils'
import { Tabs, Tab } from 'react-bootstrap'
import CourseList from './Student/CourseList'
import EventDetails from 'containers/EventDetails'
import { emptyArray } from 'utils/commonHelper'

export const StudentHome = () => {
	const state = useSelector((state: any) => state)
    const userRole = getUserRole(state)
    const students = state.users.students || emptyArray
    let student
    if (userRole === USER_ROLES.STUDENT) {
        student = students.find(x => x.id === state.eth.selectedAccount)
	}

	const [selectedTab, setSelectedTab] = useState('courses');

	const setSelectedCallback = useCallback(
		(eventKey: string | null) => {
			setSelectedTab(eventKey || '')
		},
		[]
	)

    if (!student) {
        return <></>
    }

    return (
        <Tabs
            activeKey={selectedTab}
            onSelect={setSelectedCallback}
            className="mb-3">
            <Tab eventKey="courses" title="My Courses">
                <CourseList student={student} userRole={userRole}/>
            </Tab>
            <Tab eventKey="eventDetails" title="Event Details">
                <EventDetails userRole={userRole} />
            </Tab>
        </Tabs>
    )
}
