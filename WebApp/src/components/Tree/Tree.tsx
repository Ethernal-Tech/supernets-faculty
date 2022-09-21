import path from 'path'
import { Item, ItemType } from "./Item"
import styles from './tree.module.scss'
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from "react";

type Props = {
	title: string
	data: ItemType[]
}

export const Tree = ({ title, data = [] }: Props) => {
	const history = useHistory();
	const routematch = useRouteMatch();

	const defaultItem = data[0];

	// if there is no active in URL, set default one
	useEffect(
		() => {
			// if there is no subroute, set first item as default one
			if (routematch.isExact && defaultItem) {
				history.replace(path.join(history.location.pathname, defaultItem.id));
			}
		},
		[history, routematch, defaultItem]
	)

	// find active from URL
	const activeItemId = useMemo(
		() => {
			if (routematch.isExact) {
				return defaultItem.id;
			}
			else {
				// if there is subroute, extract it and find corresponding item
				const pathSubstring = history.location.pathname.substring(routematch.url.length);
				if (pathSubstring) {
					let route = pathSubstring.split('/')[1];
					const item = data.find(item => item.id === route);
					return item?.id || defaultItem.id;
				} else {
					return defaultItem.id;
				}
			}
		},
		[routematch.isExact, history.location.pathname, routematch.url, defaultItem, data]
	)

	const onSelectCallback = useCallback(
		(id: string) => {
			if (id !== activeItemId) {
				history.push(path.join(routematch.url, id));
			}
		},
		[history, routematch, activeItemId]
	)

	return (
		<div>
			<h4 className={styles.title}>{title}</h4>
			{data.map((item) => (
				<Item
					key={item.id}
					{...item}
					onClick={onSelectCallback}
					isActive={activeItemId === item.id}
				/>
			))}
		</div>
	)
}
