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
}

type Props = {
	onSubmit(addr: string, firstName: string, lastName: string, country: string, expertise: string): void
	onCancel(): void
}

export const UserForm = ({ onSubmit, onCancel }: Props) => {
	const [values, setValues] = useState(new Model());

	const submitCallback = useCallback(
		async () => {
			await onSubmit(values.addr, values.firstName, values.lastName, values.country, values.expertise);
		},
		[onSubmit, values]
	)

    return (
		<Form
			values={values}
			onChange={setValues}
			onSubmit={submitCallback}
			onCancel={onCancel}
			submitButtonText='Add'
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
