import { useMemo } from 'react';
import styles from './notificationComponent.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import './toastrOverride.scss';
import { CheckIcon, InfoIcon, WarningIcon } from 'components/icons/icons';

type Props = {
	message: string;
	icon?: 'info' | 'success' | 'warning' | 'error';
};

const iconProps = { width: 24, height: 24, fill: 'currentColor' };

const NotificationComponent = ({ message, icon }: Props) => {
	const iconContent = useMemo(
		() => {
			let content;
			switch (icon) {
				case 'info':
					content = <InfoIcon {...iconProps} />
					break;
				case 'success':
					content = <CheckIcon {...iconProps} />
					break
				case 'warning':
					content = <WarningIcon {...iconProps} />
					break;
				case 'error':
					content = <WarningIcon {...iconProps} />
					break;
				default:
					return;
			}

			return (
				<span className={styles.icon}>
					{content}
				</span>
			)
		},
		[icon]
	)

	return (
		<div className={styles.container}>
			{iconContent}
			<span className={styles.message}>{message}</span>
		</div>
	);
};

export default NotificationComponent;
