import { Subtract } from 'utility-types';
import { Textarea, TextareaProps } from '../controls';
import { Field, ControlsCommonProps, FieldProps } from './Field';

export const TextareaField = (props: Subtract<TextareaProps, ControlsCommonProps<string>> & FieldProps) => {
	return (
		<Field
			{...props}
			Control={Textarea}
		/>
	)
}
