import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { USER_ROLES } from '../utils/constants'
import { Tabs, Tab } from 'react-bootstrap'
import { ProfessorCourses } from './Professor/ProfessorCourses'
import EventDetails from '../components/EventDetails'
import { emptyArray } from 'utils/commonHelper'
import { getUserRole } from 'utils/userUtils'

export const ProfessorEventHome = () => {
	const state = useSelector((state: any) => state)
    const professors = state.users.professors || emptyArray
    const userRole = getUserRole(state)
    let professor
    if (userRole === USER_ROLES.PROFESSOR) {
        professor = professors.find(x => x.id === state.eth.selectedAccount)
	}
	const selectedAccount = state.eth.selectedAccount

	const [selectedTab, setSelectedTab] = useState('courses');

	const setSelectedCallback = useCallback(
		(eventKey: string | null) => {
			setSelectedTab(eventKey || '')
		},
		[]
	)

    if (!professor) {
        return <></>
    }

    return (
        <Tabs
            activeKey={selectedTab}
            onSelect={setSelectedCallback}
            className="mb-3">
            <Tab eventKey="courses" title="My Courses">
                <ProfessorCourses professor={professor} selectedAccount={selectedAccount}/>
            </Tab>
            <Tab eventKey="eventDetails" title="Event Details">
                <EventDetails userRole={userRole} />
            </Tab>
        </Tabs>
    )
}
