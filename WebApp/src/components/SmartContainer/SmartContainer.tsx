import React from 'react';
import { Property } from 'csstype';
import RequiredField from './RequiredField';
import styles from './smartContainer.module.scss';

type Props = {
	children: React.ReactElement[] | React.ReactElement | any
	justifyContent?: Property.JustifyContent
}

const SmartContainer = ({ children, justifyContent }: Props) => {
	return (
		<div className={styles.container} style={{ justifyContent }}>
			{children}
		</div>
	)
}

type ItemProps = Props & {
	size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'
}

const SmartItem = ({ children, size = 'medium' }: ItemProps) => {
	return (
		<div className={styles[`item_${size}`]}>
			{children}
		</div>
	)
}

type InlineProps = Props & {
	flex?: Property.Flex
	alignItems?: Property.AlignItems
}

const SmartInline = ({ children, flex = '1', alignItems = 'center' }: InlineProps) => {
	return (
		<div className={styles.inline} style={{ alignItems }}>
			{React.Children.map(children, (child) => {
				if (!child) {
					return;
				}

				return (
					<div className={styles.inline_item} style={{ flex }}>
						{child}
					</div>
				)
			})}
		</div>
	)
}

type FormGroupProps = {
	label?: string
	isRequired?: boolean
	children: React.ReactElement | Array<React.ReactElement>
	multiline?: boolean
}

const SmartFormGroup = ({ label, isRequired, children, multiline }: FormGroupProps) => {
	const className = multiline ? styles.form_group_multiline : styles.form_group_inline;

	return (
		<div className={className}>
			{label &&
				<div className={styles.label}>
					{label}:
					{isRequired && <RequiredField />}
				</div>
			}
			<div className={styles.field}>
				{children}
			</div>
		</div>
	)
}

export {
	SmartContainer,
	SmartItem,
	SmartFormGroup,
	SmartInline
}
