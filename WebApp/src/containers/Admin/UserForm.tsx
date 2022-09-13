import { useCallback, useState } from 'react'
import { Form } from 'components/Form/Form';
import { InputField } from 'components/Form';
import { propertyOf } from 'utils/propertyOf';

class Model {
	addr!: string
	firstName!: string
	lastName!: string
	country!: string
	expertise!: string

	constructor(model?: Model) {
		if (model) {
			this.addr = model.addr;
			this.firstName = model.firstName;
			this.lastName = model.lastName;
			this.country = model.country;
			this.expertise = model.expertise;
		}
	}
}

type Props = {
	onSubmit(values: Model): void
	onCancel(): void
	user?: Model
}

export const UserForm = ({ onSubmit, onCancel, user }: Props) => {
	const [values, setValues] = useState(new Model(user));

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
						id={propertyOf<Model>('addr')}
						label='Address'
						isRequired
					/>
					<InputField
						id={propertyOf<Model>('firstName')}
						label='First name'
						isRequired
					/>
					<InputField
						id={propertyOf<Model>('lastName')}
						label='Last name'
						isRequired
					/>
					<InputField
						id={propertyOf<Model>('country')}
						label='Country'
						isRequired
					/>
					<InputField
						id={propertyOf<Model>('expertise')}
						label='Expertise'
						isRequired
					/>
				</>
			)}
		/>
    )
}
