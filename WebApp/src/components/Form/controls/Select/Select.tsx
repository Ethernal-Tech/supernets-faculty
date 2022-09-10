import React, { useCallback, useMemo } from 'react';
import { ArrowDownIcon } from 'components/icons/icons';
import { Spinner, ClipSpinner } from 'components/Spinner';
import styles from './select.module.scss';
import { ControlsCommonProps } from '../../fields';

// use this type when you don't care about item type
export type OptionType = {
	id: string
	text: string
}

export type SelectProps = ControlsCommonProps<string | number | undefined> & {
	items: Array<any>
	getItemId(item: any): string | number
	getItemText(item: any): string | undefined

	placeholder?: string
	loading?: boolean
	containsEmpty?: boolean
}

export function Select(props: SelectProps) {
	const {
		value, onChange, onBlur, disabled,
		items, getItemId, getItemText,
		placeholder, loading, containsEmpty = true
	} = props;

	const handleSelectChange = useCallback(
		(e: React.FormEvent<HTMLSelectElement>) => {
			const newValue = e.currentTarget.value;

			if (!newValue || !items || items.length === 0) {
				onChange && onChange(undefined);
				return;
			}

			// if ids are numbers, return number instead of string
			if (typeof getItemId(items[0]) === 'number') {
				onChange && onChange(parseFloat(newValue));
			} else {
				onChange && onChange(newValue);
			}

		},
		[items, getItemId, onChange]
	)

	const optionsContent = useMemo(
		() => {
			return items.map(currentItem => {
				const id = getItemId(currentItem);
				const text = getItemText(currentItem) || '';
				return <option key={id} value={id}>{text}</option>
			})
		},
		[items, getItemId, getItemText]
	)

	const selectClassName = useMemo(
		() => `${styles.select} ${value === undefined ? styles.placeholder : ''}`,
		[value]
	)

	return (
		<div className={styles.container}>
			<div className={styles.select_container}>
				<select
					value={value !== undefined ? value : ''}
					onChange={handleSelectChange}
					onBlur={onBlur}
					disabled={disabled || loading}
					className={selectClassName}
				>
					{/* placeholder */}
					{value === undefined &&
						<option value='' disabled hidden>
							{ placeholder || ''}
						</option>
					}
					{/* empty */}
					{containsEmpty &&
						<option value={undefined}></option>
					}
					{/* items options */}
					{optionsContent}
				</select>
				{/* arrow */}
				<div className={styles.arrow}>
					<ArrowDownIcon width={8} height={8} fill='currentColor' />
				</div>
				{/* loading */}
				{loading &&
					<div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
						<Spinner>
							<ClipSpinner size={20} color='#000'/>
						</Spinner>
					</div>
				}
			</div>
		</div>
	)
}
