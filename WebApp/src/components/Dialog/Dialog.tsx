import React, { useCallback, useEffect, useRef } from 'react';
import { Header } from './Header';
import styles from './dialog.module.scss';
import { Cover } from 'components/Cover';

type Props = {
	title: string | React.ReactElement,
	onClose(): void,
	open: boolean,
	children: any,
	size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge'
}

const KEY_NAME_ESC = 'Escape';
const KEY_EVENT_TYPE = 'keyup';

export const Dialog = ({ title, onClose, open, children, size = 'medium' }: Props) => {
	const dialogRef = useRef<HTMLDivElement>(null);

	const startAnimationCallback = useCallback(
		() => {
			dialogRef.current?.classList.add(styles.static);
		},
		[]
	);

	const endAnimationCallback = useCallback(
		() => {
			dialogRef.current?.classList.remove(styles.static);
		},
		[]
	)

	useEffect(
		() => {
			const ref = dialogRef.current;
			ref?.addEventListener('animationend', endAnimationCallback, false);

			return () => {
				ref?.removeEventListener('animationend', endAnimationCallback, false);
			}
		},
		[endAnimationCallback]
	)

	const handleEscKey = useCallback(
		(event) => {
			if (event.key === KEY_NAME_ESC) {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(
		() => {
			document.addEventListener(KEY_EVENT_TYPE, handleEscKey, false);

			return () => {
				document.removeEventListener(KEY_EVENT_TYPE, handleEscKey, false);
			};
		},
		[handleEscKey]
	);

	if (!open) {
		return <></>
	}

	return (
		<div
			className={`${styles.container} ${open ? styles.show : ''}`}
			onKeyUp={handleEscKey}
			ref={dialogRef}
		>
			<Cover onClick={startAnimationCallback} />
			<div
				className={`${styles.dialog} ${styles[`dialog-${size}`]}`}
			>
				<Header
					title={title}
					onClose={onClose}
				/>
				<div className={styles.content}>
					{children}
				</div>
			</div>
		</div>
	)
}
