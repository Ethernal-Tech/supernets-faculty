import path from 'path'
import { useCallback, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Tree } from 'components/Tree/Tree'
import { useSelector } from 'react-redux'

export const StudentEventNavbar = ({ event }) => {
	const { url } = useRouteMatch()
	const history = useHistory()
	const { eth } = useSelector((state: any) => state)

	const [selected, setSelected] = useState('')

	const selectCallback = useCallback(
		(id: string) => {
			setSelected(id);
			history.push(path.join(url, id));
		},
		[history, url]
	)

	// FIXME:
	// <Link to={`/student?stud=${eth.selectedAccount}`} className="nav-link">My Courses</Link>

	return (
		<Tree
			title={event.title}
			data={[
				{
					id: 'studentCourses',
					name: 'My Courses'
				},
				{
					id: 'eventDetails',
					name: 'Event Details'
				}
			]}
			onSelect={selectCallback}
			selected={selected}
		/>
    )
}
