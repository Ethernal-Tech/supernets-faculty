import { ContentShell } from 'features/Content'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { formatDate } from '../utils/utils'
import { Input, Textarea } from './Form'
import { SmartFormGroup } from './SmartContainer/SmartContainer'
import { loadUsersAction } from 'actions/userActions'
import { loadAllCoursesAction } from 'actions/coursesActions'

function EventDetails(props) {
    const startDate = new Date(parseInt(props.selectedEvent.startDate))
    const formatedDateStart = formatDate(startDate)
    const endDate = new Date(parseInt(props.selectedEvent.endDate))
    const formatedDateEnd = formatDate(endDate)

	useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        await props.loadUsers(props.selectedEvent.id)
        await props.loadAllCourse(props.selectedEvent.id)
    }

	const { title, description, venue, location } = props.selectedEvent

	return (
		<ContentShell title='Event Details'>
			<div style={{ width: '600px' }}>
				<SmartFormGroup label='Name'>
					<Input
						value={title}
					/>
				</SmartFormGroup>
				<SmartFormGroup label='Description'>
					<Textarea
						value={description}
					/>
				</SmartFormGroup>
				<SmartFormGroup label='Venue'>
					<Input
						value={venue}
					/>
				</SmartFormGroup>
				<SmartFormGroup label='Location'>
					<Input
						value={location}
					/>
				</SmartFormGroup>
				<SmartFormGroup label='Period'>
					<Input
						value={`${formatedDateStart} - ${formatedDateEnd}`}
					/>
				</SmartFormGroup>
			</div>
		</ContentShell>
	)
}

const mapStateToProps = state => ({
    selectedEvent: state.event.selectedEvent
})

const mapDispatchToProps = dispatch => ({
    loadUsers: (eventId) => loadUsersAction(eventId, dispatch),
    loadAllCourse: (eventId) => loadAllCoursesAction(eventId, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails)
