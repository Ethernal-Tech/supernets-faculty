import React from 'react';
import styles from './contentShell.module.scss';

type Props = {
	title?: string
	children: any
}

export const ContentShell = ({ title, children }: Props) => {
	return (
		<div className={styles.container}>
			{title &&
				<div className={styles.header}>
					{title && <h1>{title}</h1>}
				</div>
			}
			{children}
		</div>
	)
}
