import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../themes';
import TrackMap, { Coordinate } from './track-map';

test('should render svg with provided points', async () => {
	const dataPoints: Coordinate[] = [
		{ x: 1, y: 2 },
		{ x: 3, y: 4 },
		{ x: 5, y: 6 }
	]

	render(
		<ThemeProvider theme={lightTheme}>
			<TrackMap data={dataPoints}></TrackMap>
		</ThemeProvider>
	);

	const svg = screen.getByTitle('Track Map').parentElement;
	expect(svg).toBeInTheDocument();

	const path = svg?.querySelector('path');
	expect(path).toBeInTheDocument();
	expect(path).toHaveAttribute('d', `M 1 2 L 3 4 L 5 6 Z`)
});

test('should set viewbox to min and max values in data', async () => {
	const dataPoints: { [lapDistance: number]: Coordinate } = [
		{ x: -10, y: 2 },
		{ x: 3, y: -3 },
		{ x: 5, y: 6 }
	]

	render(
		<ThemeProvider theme={lightTheme}>
			<TrackMap data={dataPoints}></TrackMap>
		</ThemeProvider>
	);

	const svg = screen.getByTitle('Track Map').parentElement;
	expect(svg).toBeInTheDocument();
	expect(svg).toHaveAttribute('viewBox', '-10 -3 5 6');
});