export const isNumeric = (value: string | number): boolean => {
	return value != null
		&& value !== ''
		&& !isNaN(Number(value));
}