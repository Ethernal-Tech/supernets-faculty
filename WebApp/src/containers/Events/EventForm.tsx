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

	constructor(model?) {
		if (model) {
			this.title = model.title;
			this.location = model.location;
			this.venue = model.venue;
			this.description = model.description;
			this.startDate = new Date(parseInt(model.startDate));
			this.endDate = new Date(parseInt(model.endDate));
		}
	}
}

export const EventForm = ({ onSubmit, onCancel, event }) => {
	const [values, setValues] = useState(new Model(event))

	const submitCallback = useCallback(
		async () => {
            await onSubmit(values)
			setValues(new Model())
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
