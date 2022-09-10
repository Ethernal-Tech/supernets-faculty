export const isRequiredValidator = (value: any): string => {
	if (value === null || value === undefined || value === ''
		|| (value instanceof Map && value.size === 0)
		|| (value instanceof Set && value.size === 0)
		|| (value instanceof Array && value.length === 0)
	) {
		return 'This field is required'
	} else {
		return ''
	}
}

export const isEmailValidator = (value: string) => {
	if (!value) {
		return '';
	}

	const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!regex.test(value)) {
		return 'Invalid email';
	}

	return '';
}

export const isLinkValidator = (value: string) => {
	if (!value) {
		return '';
	}

	const regex = /([a-zA-Z]{3,5}:\/\/|www\.)[-a-zA-Z0-9@:%_\\+.~#?*&//=]+/gi;

	if (!regex.test(value)) {
		return 'Invalid link';
	}

	return '';
}
