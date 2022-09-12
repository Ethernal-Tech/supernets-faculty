import { useCallback, useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import EventDetails from '../components/EventDetails'
import { ProfessorList } from './Admin/Proffesors/ProfessorList'
import { StudentList } from './Admin/Students/StudentList'
import { AdminList } from './Admin/Admin/AdminList';

type Props = {
	userRole: any
}

export const AdminEventHome = ({ userRole }: Props) => {
	const [selectedTab, setSelectedTab] = useState('eventDetails');

	const setSelectedCallback = useCallback(
		(eventKey: string | null) => {
			setSelectedTab(eventKey || '')
		},
		[]
	)

    return (
        <Tabs
            activeKey={selectedTab}
            onSelect={setSelectedCallback}
            className="mb-3">
            <Tab eventKey="eventDetails" title="Event Details">
                <EventDetails userRole={userRole} />
            </Tab>
            <Tab eventKey="professors" title="Professors">
                <ProfessorList />
            </Tab>
            <Tab eventKey="students" title="Students">
                <StudentList />
            </Tab>
            <Tab eventKey="admins" title="Event Admins">
                <AdminList />
            </Tab>
        </Tabs>
    )
}
