import { Subtract } from 'utility-types';
import { Select, SelectProps } from '../controls';
import { Field, FieldProps, ControlsCommonProps } from './Field';

export const SelectField = (props: Subtract<SelectProps, ControlsCommonProps<string | number | undefined>> & FieldProps) => {
	return (
		<Field
			{...props}
			Control={Select}
		/>
	)
}
