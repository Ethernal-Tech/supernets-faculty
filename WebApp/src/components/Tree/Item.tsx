import { useCallback } from "react"
import styles from './tree.module.scss'

export type ItemType = {
	id?: string
	name?: string
}

type Props = ItemType & {
	onClick(id?: string): void
	selected: string
}

export const Item = ({ id, name, onClick, selected }: Props) => {
	const onClickCallback = useCallback(
		() => {
			onClick(id);
		},
		[id, onClick]
	)

	return (
		<div className={styles.item} >
			<div className={`${styles.item_content} ${id === selected ? styles.selected : 'clickable'}`} onClick={onClickCallback}>
				{name}
			</div>
		</div>
	)
}
