import path from 'path'
import { Tree } from 'components/Tree/Tree'
import { useCallback, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'

export const AdminEventNavbar = ({ event }) => {
	const { url } = useRouteMatch()
	const history = useHistory();

	const [selected, setSelected] = useState('')

	const selectCallback = useCallback(
		(id: string) => {
			setSelected(id);
			history.push(path.join(url, id));
		},
		[history, url]
	)

	return (
		<Tree
			title={event.title}
			data={[
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
			]}
			onSelect={selectCallback}
			selected={selected}
		/>
    )
}
