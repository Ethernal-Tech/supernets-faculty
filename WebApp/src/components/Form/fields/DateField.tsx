import { Subtract } from 'utility-types';
import { DatePicker, DatePickerProps } from '../controls';
import { Field, ControlsCommonProps, FieldProps } from './Field';

export const DateField = (props: Subtract<DatePickerProps, ControlsCommonProps<Date>> & FieldProps) => {
	return (
		<Field
			{...props}
			Control={DatePicker}
		/>
	)
}
