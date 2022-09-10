import React from 'react';
import styles from './columnContainer.module.scss'

type Props = {
	children: React.ReactElement | Array<React.ReactElement> | any
	margin?: 'xlarge' | 'large' | 'medium' | 'small' | 'disabled'
}

export const ColumnContainer = ({ children, margin = 'large' }: Props) => {
	return (
		<div className={styles.container}>
			{React.Children.map(children, (child) => (
				<div className={styles[`item_${margin}`]}>
					{child}
				</div>
			))}
		</div>
	)
}
