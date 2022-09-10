import { useCallback } from 'react';
import styles from './cover.module.scss';

type Props = {
	onClick(): void
	transparent?: boolean
}

export const Cover = ({ onClick, transparent }: Props) => {
	const onClickCallback = useCallback(
		(e) => {
			e.stopPropagation();
			onClick();
		},
		[onClick]
	)

	return (
		<div
			className={`${styles.container} ${transparent ? styles.transparent : ''}`}
			onClick={onClickCallback}
		/>
	)
}
