import { ContentShell } from 'features/Content'
import React from 'react'
import { Input, Textarea } from './Form'
import { SmartFormGroup } from './SmartContainer/SmartContainer'

class CourseDetailsComponent extends React.Component {
    constructor(props) {
        super(props)

        const startDate = new Date(parseInt(props.course.startTime))
        this.formatedStartDate = startDate.toLocaleString()
    }

    render() {
        const { title, description, venue, points } = this.props.course
        return (
            <ContentShell title='Course Details'>
				<div style={{ width: '600px' }}>
					<SmartFormGroup label='Name'>
						<Input
							value={title}
							disabled
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Description'>
						<Textarea
							value={description}
							disabled
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Start time'>
						<Input
							value={this.formatedStartDate}
							disabled
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Venue'>
						<Input
							value={venue}
							disabled
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Points'>
						<Input
							value={points}
							disabled
						/>
					</SmartFormGroup>
				</div>
            </ContentShell>
        )
    }
}

export default CourseDetailsComponent
