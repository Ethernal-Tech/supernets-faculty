import { Tree } from 'components/Tree/Tree'
import { useSelector } from 'react-redux'

const data = [
	{
		id: 'studentCourses',
		name: 'My Courses'
	},
	{
		id: 'eventDetails',
		name: 'Event Details'
	}
]

export const StudentEventNavbar = ({ event }) => {
	const { eth } = useSelector((state: any) => state)

	// FIXME:
	// <Link to={`/student?stud=${eth.selectedAccount}`} className="nav-link">My Courses</Link>

	return (
		<Tree
			title={event.title}
			data={data}
		/>
    )
}
