import { ContentShell } from 'features/Content'
import React from 'react'
import { connect } from 'react-redux'
import { formatDate } from '../utils/utils'
import { Input, Textarea } from './Form'
import { SmartFormGroup } from './SmartContainer/SmartContainer'

class EventDetails extends React.Component {
    constructor(props) {
        super(props)
        const startDate = new Date(parseInt(props.selectedEvent.startDate))
        this.formatedDateStart = formatDate(startDate)
        const endDate = new Date(parseInt(props.selectedEvent.endDate))
        this.formatedDateEnd = formatDate(endDate)
    }

    render() {
        const { title, description, venue, location } = this.props.selectedEvent

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
							value={`${this.formatedDateStart} - ${this.formatedDateEnd}`}
						/>
					</SmartFormGroup>
				</div>
            </ContentShell>
        )
    }
}

const mapStateToProps = state => ({
    selectedEvent: state.event.selectedEvent
})

export default connect(mapStateToProps)(EventDetails)
