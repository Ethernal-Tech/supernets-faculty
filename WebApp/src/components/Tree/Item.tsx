import { useCallback } from "react"
import styles from './tree.module.scss'

export type ItemType = {
	id: string
	name: string
}

type Props = ItemType & {
	onClick(id?: string): void
	isActive: boolean
}

export const Item = ({ id, name, onClick, isActive }: Props) => {
	const onClickCallback = useCallback(
		() => {
			onClick(id);
		},
		[id, onClick]
	)

	return (
		<div className={styles.item}>
			<div className={isActive ? styles.selected : undefined} onClick={onClickCallback}>
				{name}
			</div>
		</div>
	)
}
