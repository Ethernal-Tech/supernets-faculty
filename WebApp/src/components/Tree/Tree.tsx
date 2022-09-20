import { Item, ItemType } from "./Item"

type Props = {
	title: string
	data: ItemType[]
	onSelect(id: string): void
	selected: string
}

export const Tree = ({ title, data = [], onSelect, selected }: Props) => {
	return (
		<div>
			<h3>{title}</h3>
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
