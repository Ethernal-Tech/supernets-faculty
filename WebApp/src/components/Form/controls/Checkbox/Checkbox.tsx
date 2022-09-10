import { CheckIcon } from 'components/icons/icons';
import { useCallback } from 'react';
import { ControlsCommonProps } from '../../fields';
import styles from './checkbox.module.scss';

export type CheckboxProps = ControlsCommonProps<boolean> & {
	labelBefore?: string
	labelBeforeAdditional?: string
}

export const Checkbox = ({ value, disabled, onChange, labelBefore, labelBeforeAdditional }: CheckboxProps) => {
	const onChangeCallback = useCallback(
		() => {
			if (!disabled) {
				onChange && onChange(!value);
			}
		},
		[value, disabled, onChange]
	)

	const labelClassName = `${styles.label} ${disabled ? styles.disabled : ''} ${value ? styles.checked : ''}`;

	return (
		<div className={styles.container}>
			<label className={labelClassName} onClick={onChangeCallback}>
				{value &&
					<span className={styles.icon}>
						<CheckIcon width={16} height={16} fill='currentColor' />
					</span>
				}
				<span className={styles.text}>
					<span>{labelBefore}</span>
					{labelBeforeAdditional && <span className={styles.additionalText}>&nbsp;{labelBeforeAdditional}</span>}
				</span>
			</label>
		</div>
	)
}
