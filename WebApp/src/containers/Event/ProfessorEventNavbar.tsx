import { Tree } from 'components/Tree/Tree'

const data = [
	{
		id: 'professorCourses',
		name: 'My Courses'
	},
	{
		id: 'eventDetails',
		name: 'Event Details'
	}
]

export const ProfessorEventNavbar = ({ event }) => {
	return (
		<Tree
			title={event.title}
			data={data}
		/>
    )
}
