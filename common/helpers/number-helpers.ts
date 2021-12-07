export const roundToDecimalPlaces = (value: number, decimalPlaces: number): number => {
	const multiplier = 10 ** (decimalPlaces);
	return Math.round(value * multiplier) / multiplier;
}