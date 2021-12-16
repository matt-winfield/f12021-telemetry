import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import store from '../../store';
import { lightTheme } from '../../themes';
import TrackMap, { Coordinate } from './track-map';

test('should render svg with provided points', async () => {
	const dataPoints: Coordinate[] = [
		{ x: 1, y: 2 },
		{ x: 3, y: 4 },
		{ x: 5, y: 6 }
	]

	render(
		<Provider store={store}>
			<ThemeProvider theme={lightTheme}>
				<TrackMap data={dataPoints}></TrackMap>
			</ThemeProvider>
		</Provider>
	);

	const svg = screen.getByTitle('Track Map').parentElement;
	expect(svg).toBeInTheDocument();

	const path = svg?.querySelector('path');
	expect(path).toBeInTheDocument();
	expect(path).toHaveAttribute('d', `M 1 2 L 3 4 L 5 6 Z`)
});

test('should set correct viewbox x, y, width and height', async () => {
	const dataPoints: { [lapDistance: number]: Coordinate } = [
		{ x: -10, y: 2 },
		{ x: 3, y: -3 },
		{ x: 5, y: 6 }
	]

	render(
		<Provider store={store}>
			<ThemeProvider theme={lightTheme}>
				<TrackMap data={dataPoints}></TrackMap>
			</ThemeProvider>
		</Provider>
	);

	const svg = screen.getByTitle('Track Map').parentElement;
	expect(svg).toBeInTheDocument();
	expect(svg).toHaveAttribute('viewBox', '-10 -3 15 9');
});