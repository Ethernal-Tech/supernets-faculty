import { useCallback, useState } from 'react'
import { Form } from 'components/Form/Form';
import { DateField, InputField } from 'components/Form';
import { propertyOf } from 'utils/propertyOf';

class Model {
	id!: number
	title!: string
	startTime!: string
	venue!: string
	points!: number
	description!: string

	constructor(model?: Model) {
		if (model) {
			this.id = model.id;
			this.title = model.title;
			//this.startTime = model.startTime;
			this.venue = model.venue;
			this.points = model.points;
			this.description = model.description;
		}
	}
}

type Props = {
	onSubmit(values: Model): void
	onCancel(): void
	course?: Model
}

export const CourseForm = ({ onSubmit, onCancel, course }: Props) => {
	const [values, setValues] = useState(new Model(course));

	const submitCallback = useCallback(
		async () => {
			await onSubmit(values);
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
						label='Name'
						isRequired
					/>
					<DateField
						id={propertyOf<Model>('startTime')}
						label='Start date'
						isRequired
					/>
					<InputField
						id={propertyOf<Model>('venue')}
						label='Venue'
						isRequired
					/>
					{/* FIXME: InputNumber for points */}
					<InputField
						id={propertyOf<Model>('points')}
						label='Points'
						isRequired
					/>
					<InputField
						id={propertyOf<Model>('description')}
						label='Description'
						isRequired
					/>
				</>
			)}
		/>
    )
}
