import { getCssVariableValue } from 'utils/cssVariablesUtils';
import styles from './clipSpinner.module.scss';

type ClipSpinnerProps = {
	size: number
	color?: string
}

export const ClipSpinner = ({ size, color }: ClipSpinnerProps) => {
	const brandColor = getCssVariableValue('--brand-color');

	const spinnerColor = color || brandColor;

	return (
		<div
			className={styles.spinner_clip}
			style={{
				borderLeftColor: spinnerColor,
				borderTopColor: spinnerColor,
				borderRightColor: spinnerColor,
				borderBottomColor: 'transparent',
				width: size,
				height: size
			}}
		/>
	)
}
