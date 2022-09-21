import { Item, ItemType } from "./Item"
import styles from './tree.module.scss'

type Props = {
	title: string
	data: ItemType[]
	onSelect(id: string): void
	selected: string
}

export const Tree = ({ title, data = [], onSelect, selected }: Props) => {
	return (
		<div>
			<h4 className={styles.title}>{title}</h4>
			{data.map((item) => (
				<Item
					key={item.id}
					{...item}
					onClick={onSelect}
					selected={selected}
				/>
			))}
		</div>
	)
}
