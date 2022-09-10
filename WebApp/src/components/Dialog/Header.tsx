import { DeleteIcon } from 'components/icons/icons';
import styles from './dialog.module.scss';

type Props = {
	title: string | React.ReactElement
	onClose?(): void
}

export const Header = ({ title, onClose }: Props) => {
	return (
		<div className={styles.header}>
			<div className={styles.title}>
				<h2>{title}</h2>
			</div>
			<DeleteIcon fill='currentColor' width={14} height={14} className={styles.close} onClick={onClose} />
		</div>
	);
}
