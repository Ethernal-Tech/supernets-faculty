import path from 'path'
import { useCallback, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { Tree } from 'components/Tree/Tree'

export const ProfessorEventNavbar = ({ event }) => {
	const { url } = useRouteMatch()
	const history = useHistory()

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
					id: 'professorCourses',
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
