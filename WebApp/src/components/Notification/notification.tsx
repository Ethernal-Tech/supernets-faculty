import { toast, ToastContent, TypeOptions, ToastOptions } from 'react-toastify';
import NotificationComponent from './NotificationComponent';

type NotificationTypeOptions = {
	type: TypeOptions;
};

type FunctionType = (message: string, customOptions?: ToastOptions) => React.ReactText;

type NotificationModel = {
	info: FunctionType;
	success: FunctionType;
	warning: FunctionType;
	error: FunctionType;
};

const mergeOptions = (typeOptions: NotificationTypeOptions, customOptions?: ToastOptions) => {
	const defaultOptions = {
		hideProgressBar: true,
		draggable: false,
	};

	return { ...defaultOptions, ...customOptions, ...typeOptions };
};

const toastMessage = (
	toastComponent: ToastContent,
	typeOptions: NotificationTypeOptions,
	customOptions?: ToastOptions
) => {
	const options = mergeOptions(typeOptions, customOptions);
	return toast(toastComponent, options);
};

const notifications: NotificationModel = {
	info: (message: string, customOptions?: ToastOptions) => {
		const typeOptions = { type: toast.TYPE.INFO };
		return toastMessage(
			<NotificationComponent message={message} icon='info' />,
			typeOptions,
			customOptions
		);
	},
	success: (message: string, customOptions?: ToastOptions) => {
		const typeOptions = { type: toast.TYPE.SUCCESS };
		return toastMessage(
			<NotificationComponent message={message} icon='success' />,
			typeOptions,
			customOptions
		);
	},
	warning: (message: string, customOptions?: ToastOptions) => {
		const typeOptions = { type: toast.TYPE.WARNING, autoClose: false };
		return toastMessage(
			<NotificationComponent message={message} icon='warning' />,
			typeOptions,
			customOptions
		);
	},
	error: (message: string, customOptions?: ToastOptions) => {
		const typeOptions = { type: toast.TYPE.ERROR, autoClose: false };
		return toastMessage(
			<NotificationComponent message={message} icon='error' />,
			typeOptions,
			customOptions
		);
	},
};

export default notifications;
