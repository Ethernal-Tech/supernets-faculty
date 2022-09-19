import { useCallback } from 'react';
import { TabType } from './Tabs';
import styles from './tab.module.scss';

type Props = {
	tab: TabType
	isActive: boolean
	onClick(tab: TabType): void
}

export const Tab = ({ tab, isActive, onClick }: Props) => {
	const onClickCallback = useCallback(
		() => {
			!tab.disabled && onClick(tab);
		},
		[tab, onClick]
	)

	return (
		<div
			className={`${styles.tab} ${isActive ? styles.active : ''} ${tab.disabled ? styles.disabled : ''}`}
			onClick={onClickCallback}
		>
			{tab.title}
		</div>
	)
}
