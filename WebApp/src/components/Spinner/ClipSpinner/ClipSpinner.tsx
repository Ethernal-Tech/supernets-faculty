import styles from './clipSpinner.module.scss';

type ClipSpinnerProps = {
	size: number,
	color: string
}

export const ClipSpinner = ({ size, color }: ClipSpinnerProps) => {
	return (
		<div
			className={styles.spinner_clip}
			style={{
				borderLeftColor: color,
				borderTopColor: color,
				borderRightColor: color,
				borderBottomColor: 'transparent',
				width: size,
				height: size
			}}
		/>
	)
}
