import { useCallback, useEffect, useMemo } from 'react';
import path from 'path';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Tab } from './Tab';
import styles from './tab.module.scss';

export type TabType = {
	id: string
	title: string | JSX.Element
	// note: some text specific for tab, shown on top of tabs
	note?: string
	route?: string
	disabled?: boolean
	component: any
}

type Props = {
	tabs: TabType[]
	tabComponentProps?: any
}

export const Tabs = ({ tabs = [], tabComponentProps }: Props) => {
	const history = useHistory();
	const routematch = useRouteMatch();

	const defaultTab = tabs[0];

	// if there is no active tab in URL, set default tab
	useEffect(
		() => {
			// if there is no subroute, set first tab as default one
			if (routematch.isExact && defaultTab) {
				history.replace(path.join(history.location.pathname, `${defaultTab.route}`), history.location.state);
			}
		},
		[history, routematch, tabs, defaultTab]
	)

	// find active tab from URL
	const activeTabMemo = useMemo(
		() => {
			if (routematch.isExact) {
				return defaultTab;
			}
			else {
				// if there is subroute, extract it and find corresponding tab
				const pathSubstring = history.location.pathname.substring(routematch.url.length);
				if (pathSubstring) {
					let route = pathSubstring.split('/')[1];
					const tab = tabs.find(tab => tab.route === route);
					return tab || defaultTab;
				} else {
					return defaultTab;
				}
			}
		},
		[routematch.isExact, history.location.pathname, routematch.url, tabs, defaultTab]
	)

	const changeTabCallback = useCallback(
		(tab: TabType) => {
			if (tab.route && tab.route !== activeTabMemo.route) {
				history.push(path.join(routematch.url, tab.route), history.location.state);
			}
		},
		[history, routematch, activeTabMemo.route]
	)

	const navigationContent = useMemo(
		() => {
			return tabs.map((tab) => (
				<Tab
					key={tab.id}
					tab={tab}
					isActive={!!activeTabMemo && tab.id === activeTabMemo.id}
					onClick={changeTabCallback}
				/>
			));
		},
		[tabs, activeTabMemo, changeTabCallback]
	)

	if (!activeTabMemo) {
		return <></>
	}

	return (
		<>
			{activeTabMemo.note && (
				<div style={{ marginBottom: '10px' }}>
					<small>{activeTabMemo.note}</small>
				</div>
			)}
			<div>
				<div className={styles.navigation}>
					{navigationContent}
				</div>
				<div className={styles.content}>
					<activeTabMemo.component {...tabComponentProps} />
				</div>
			</div>
		</>
	)
}
