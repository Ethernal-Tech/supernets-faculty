import { useMemo } from 'react'
import { Input, Textarea } from 'components/Form'
import { SmartFormGroup } from 'components/SmartContainer/SmartContainer'
import { CoursesTabProps } from './Course'

export const CourseDetails = ({ course }: CoursesTabProps) => {
	const { title, description, venue, points, startTime } = course

	const formattedStartDate = useMemo(
		() => {
			const startDate = new Date(parseInt(startTime))
			return startDate.toLocaleString()
		},
		[startTime]
	)

    return (
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
			<SmartFormGroup label='Start time'>
				<Input
					value={formattedStartDate}
				/>
			</SmartFormGroup>
			<SmartFormGroup label='Venue'>
				<Input
					value={venue}
				/>
			</SmartFormGroup>
			<SmartFormGroup label='Points'>
				<Input
					value={points}
				/>
			</SmartFormGroup>
		</div>
    )
}
