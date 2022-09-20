export const getCssVariableValue = (name: string) => {
	const value = getComputedStyle(document.body).getPropertyValue(name);
	return value.trim();
}

export const setCssVariableValue = (name: string, value: string) => {
	document.body.style.setProperty(name, value);
}
