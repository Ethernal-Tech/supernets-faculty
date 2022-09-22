import { useCallback, useState } from 'react'
import { Form } from 'components/Form/Form';
import { DateField, InputField } from 'components/Form';
import { propertyOf } from 'utils/propertyOf';

class Model {
	id!: number
	title!: string
	startTime!: Date
	venue!: string
	points!: number
	description!: string
	professor!: string

	constructor(model?, professorId?) {
		if (model) {
			this.id = model.id;
			this.title = model.title;
			this.startTime = new Date(parseInt(model.startTime));
			this.venue = model.venue;
			this.points = model.points;
			this.description = model.description;
			this.professor = model.professor;
		} else if (professorId) {
			this.professor = professorId;
		}
	}
}

type Props = {
	event?
	onSubmit(values: Model): void
	onCancel(): void
	course?: Model
	professorId?: string
}

export const CourseForm = ({ event, onSubmit, onCancel, course, professorId }: Props) => {
	const minDate = new Date(parseInt(event.startDate))
	const maxDate = new Date(parseInt(event.endDate))

	const [values, setValues] = useState(new Model(course, professorId));

	const submitCallback = useCallback(
		async () => {
			await onSubmit(values);
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
						id={propertyOf<Model>('professor')}
						label='Professor address'
						isRequired
					/>
					<InputField
						id={propertyOf<Model>('title')}
						label='Name'
						isRequired
					/>
					<DateField
						id={propertyOf<Model>('startTime')}
						label='Start date'
						minDate={minDate}
						maxDate={maxDate}
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
