import { useCallback } from 'react';
import DatePickerLib from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from 'components/icons/icons';
import { ControlsCommonProps } from '../../fields';
import styles from './datePicker.module.scss';

export type DatePickerProps = ControlsCommonProps<Date> & {
	minDate?: Date
	maxDate?: Date
	showTime?: boolean
	dateFormat?: string
};

export const DatePicker = ({
	value,
	onChange,
	onBlur,
	disabled,
	minDate,
	maxDate,
	showTime,
	dateFormat = 'MM/dd/yyyy'
}: DatePickerProps) => {
	const onChangeCallback = useCallback(
		(date) => onChange && onChange(date),
		[onChange]
	)

	return (
		<div className={styles.container}>
			<DatePickerLib
				className={styles.date_picker}
				selected={value}
				onChange={onChangeCallback}
				onBlur={onBlur}
				disabled={disabled}
				minDate={minDate}
				maxDate={maxDate}
				showMonthDropdown
				showYearDropdown
				yearDropdownItemNumber={3}
				showTimeSelect={showTime}
				dateFormat={dateFormat}
			/>
			<div className={styles.icon}>
				<CalendarIcon width={16} height={16} fill='currentColor' />
			</div>
		</div>
	)
}
