import { Spinner, ClipSpinner } from 'components/Spinner';
import React from 'react';
import styles from './button.module.scss';

interface Props {
	children?: React.ReactElement
	text?: string
	isLoading?: boolean
	disabled?: boolean
	color?: 'primary' | 'secondary' | 'destructive' | 'neutral'
	onClick(): void
	tooltip?: string
}

export const Button = ({ children, text, isLoading, disabled, color = 'primary', onClick, tooltip }: Props) => {
	const btnClassName = `${styles.btn} ${styles[`btn-${color}`]} ${disabled ? styles.disabled : ''}`;

	return (
		<button
			className={btnClassName}
			onClick={onClick}
			disabled={disabled || isLoading}
			title={tooltip}
		>
			{children || text}
			{isLoading &&
				<div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
					<Spinner>
						<ClipSpinner size={20} color='#000' />
	 				</Spinner>
	 			</div>
	 		}
		</button>
	)
}
