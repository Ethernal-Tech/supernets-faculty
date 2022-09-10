import React from 'react';
import { Property } from 'csstype';
import styles from './rowContainer.module.scss';

type Props = {
	children: any
	margin?: 'large' | 'medium' | 'small' | 'xsmall' | 'xlarge'
	justifyContent?: Property.JustifyContent
	alignItems?: Property.AlignItems
	flex?: Property.Flex
	wrap?: Property.FlexWrap
}

export const RowContainer = ({ children, margin = 'small', justifyContent, alignItems, flex, wrap }: Props) => {
	return (
		<div className={styles.container} style={{ justifyContent, alignItems, flexWrap: wrap }}>
			{React.Children.map(children, (child) => {
				if (!child) {
					return;
				}

				return (
					<div className={styles[`item_${margin}`]} style={{ flex }}>
						{child}
					</div>
				)
			})}
		</div>
	)
}
