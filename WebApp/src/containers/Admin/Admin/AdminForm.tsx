import { useCallback, useState } from 'react'
import { Form } from 'components/Form/Form';
import { InputField } from 'components/Form';
import { propertyOf } from 'utils/propertyOf';

class Model {
	addr!: string
}

type Props = {
	onSubmit(addr: string): void
	onCancel(): void
}

export const AdminForm = ({ onSubmit, onCancel }: Props) => {
	const [values, setValues] = useState(new Model());

	const submitCallback = useCallback(
		async () => {
			await onSubmit(values.addr);
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
				<InputField
					id={propertyOf<Model>('addr')}
					label="Admin's address"
					isRequired
				/>
			)}
		/>
    )
}
