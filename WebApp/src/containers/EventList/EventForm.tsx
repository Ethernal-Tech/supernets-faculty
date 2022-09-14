import { useCallback, useState } from 'react'
import { DateField, Form, InputField, TextareaField } from 'components/Form'
import { propertyOf } from 'utils/propertyOf'

const dateNow = new Date();

class Model {
	title!: string
    location!: string
    venue!: string
    description!: string
    startDate!: Date
    endDate!: Date

	constructor(model?: Model) {
		if (model) {
			this.title = model.title;
			this.location = model.location;
			this.venue = model.venue;
			this.description = model.description;
		}
	}
}

export const EventForm = ({ onSubmit, onCancel, event }) => {
	const [values, setValues] = useState(new Model(event))

	const submitCallback = useCallback(
		async () => {
            const timeStartMs = values.startDate.getTime()
            const timeEndMs = values.endDate.getTime()
            await onSubmit(values.title, values.location, values.venue, timeStartMs, timeEndMs, values.description)
		},
		[onSubmit, values]
	)

    return (
		<Form
			values={values}
			onChange={setValues}
			onSubmit={submitCallback}
			onCancel={onCancel}
			submitButtonText='Save'
			render={() => (
				<>
					<InputField
						id={propertyOf<Model>('title')}
						label='Event name'
						isRequired
					/>
					<InputField
						id={propertyOf<Model>('location')}
						label='Location'
						isRequired
					/>
					<InputField
						id={propertyOf<Model>('venue')}
						label='Venue'
						isRequired
					/>
					<DateField
						id={propertyOf<Model>('startDate')}
						label='Start date'
						minDate={dateNow}
						isRequired
					/>
					<DateField
						id={propertyOf<Model>('endDate')}
						label='End date'
						minDate={values.startDate}
						isRequired
					/>
					<TextareaField
						id={propertyOf<Model>('description')}
						label='Description'
						isRequired
					/>
				</>
			)}
		/>
    )
}
