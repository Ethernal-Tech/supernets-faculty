import styles from './spinner.module.scss';

type SpinnerProps = {
	children: any,
	text?: string,
	textColor?: string
}

export const Spinner = ({ children, text, textColor }: SpinnerProps) => {
	return (
		<div className={styles.spinner} style={{ color: textColor }}>
			{children}
			{text && <label className={styles.text}>{text}</label>}
		</div>
	)
}
