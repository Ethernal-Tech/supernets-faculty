import { useCallback } from 'react';
import styles from './input.module.scss';
import { ControlsCommonProps } from '../../fields';

export type InputProps = ControlsCommonProps<string> & {
	type?: string
	placeholder?: string
	focus?: boolean
}

export const Input = ({
	value,
	onChange,
	disabled,
	onBlur,
	type = 'text',
	placeholder,
	focus
}: InputProps) => {
	const onChangeCallback = useCallback(
        (e) => onChange && onChange(e.target.value),
        [onChange]
	)

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<input
					className={styles.input}
					type={type}
					value={value || ''}
					onChange={onChangeCallback}
					onBlur={onBlur}
					placeholder={placeholder}
					autoFocus={focus}
					disabled={disabled}
					min = "1"
				/>
			</div>
		</div>
	)
}
