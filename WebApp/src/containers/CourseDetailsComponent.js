import { ContentShell } from 'features/Content'
import React from 'react'
import { Input, Textarea } from 'components/Form'
import { SmartFormGroup } from 'components/SmartContainer/SmartContainer'

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
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Description'>
						<Textarea
							value={description}
						/>
					</SmartFormGroup>
					<SmartFormGroup label='Start time'>
						<Input
							value={this.formatedStartDate}
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
            </ContentShell>
        )
    }
}

export default CourseDetailsComponent
