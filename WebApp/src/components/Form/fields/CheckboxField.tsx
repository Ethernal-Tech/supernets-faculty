import { Subtract } from 'utility-types';
import { Field, ControlsCommonProps, FieldProps } from './Field';
import { Checkbox, CheckboxProps } from '../controls';

export const CheckboxField = (props: Subtract<CheckboxProps, ControlsCommonProps<boolean>> & FieldProps) => {
	return (
		<Field
			{...props}
			Control={Checkbox}
		/>
	)
}
