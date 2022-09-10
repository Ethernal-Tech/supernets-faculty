import { Subtract } from 'utility-types';
import { Input, InputProps } from '../controls';
import { Field, ControlsCommonProps, FieldProps } from './Field';

export const InputField = (props: Subtract<InputProps, ControlsCommonProps<string>> & FieldProps) => {
	return (
		<Field
			{...props}
			Control={Input}
		/>
	)
	}
