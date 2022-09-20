import { ContentShell } from 'features/Content'
import { formatDate } from 'utils/utils'
import { Input, Textarea } from 'components/Form'
import { SmartFormGroup } from 'components/SmartContainer/SmartContainer'

export const Details = ({ event }) => {
    const startDate = new Date(parseInt(event.startDate))
    const formatedDateStart = formatDate(startDate)
    const endDate = new Date(parseInt(event.endDate))
    const formatedDateEnd = formatDate(endDate)

	const { title, description, venue, location } = event

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
