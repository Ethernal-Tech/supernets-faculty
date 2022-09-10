import { useCallback } from 'react';
import { ControlsCommonProps } from '../../fields';
import styles from './textarea.module.scss';

export type TextareaProps = ControlsCommonProps<string> & {
	placeholder?: string
	rows?: number
	focus?: boolean
}

export const Textarea = ({ value, onChange, onBlur, disabled, placeholder, rows = 4, focus }: TextareaProps) => {
	const onChangeCallback = useCallback(
		(e) => onChange && onChange(e.target.value),
		[onChange]
	)

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<textarea
					className={styles.textarea}
					onChange={onChangeCallback}
					onBlur={onBlur}
					placeholder={placeholder}
					disabled={disabled}
					// when value is null or undefined, React threats that as uncontrolled component and doesn't change value
					value={value || ''}
					rows={rows}
					autoFocus={focus}
				/>
			</div>
		</div>
	)
}
