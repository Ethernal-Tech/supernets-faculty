import styles from './separator.module.scss';

type Props = {
	margin?: 'xlarge' | 'large' | 'medium' | 'small',
}

const VerticalSeparator = ({ margin = 'large' }: Props) => {
	return (
		<div className={styles[`vertical_${margin}`]} />
	)
}

export default VerticalSeparator;
