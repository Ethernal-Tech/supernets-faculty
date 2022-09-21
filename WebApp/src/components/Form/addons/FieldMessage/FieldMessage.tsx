import styles from './fieldMessage.module.scss';

type Props = {
	message?: string
	type?: 'error'
}

export const FieldMessage = ({ message, type = 'error' }: Props) => {
	return (
		<>
			{message && <div className={`${styles.container} ${styles[type]}`}>{message}</div>}
		</>
	)
}
