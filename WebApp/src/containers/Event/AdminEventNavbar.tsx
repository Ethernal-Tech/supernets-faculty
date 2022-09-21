import { Tree } from 'components/Tree/Tree'

const data = [
	{
		id: 'eventDetails',
		name: 'Event Details'
	}, {
		id: 'professors',
		name: 'Professors'
	}, {
		id: 'courses',
		name: 'Courses'
	}, {
		id: 'students',
		name: 'Students'
	}, {
		id: 'admins',
		name: 'Event Admins'
	}
]

export const AdminEventNavbar = ({ event }) => {
	return (
		<Tree
			title={event.title}
			data={data}
		/>
    )
}
