import { fireEvent, render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';
import { LapInfo } from '../../../../common/model/lap-info';
import { lightTheme } from '../../themes';
import ReferenceDataSelector from './reference-data-selector';

const testTrackId = 1;
const mockLaps: LapInfo[] = [
	{ sessionUID: 'session1', driverName: 'driver1', lapNumber: 1, trackId: testTrackId },
	{ sessionUID: 'session1', driverName: 'driver1', lapNumber: 2, trackId: testTrackId }
];

const server = setupServer(
	rest.get(`http://localhost:3001/laps`, (request, response, context) => {
		return response(
			context.status(200),
			context.json<LapInfo[]>(mockLaps)
		);
	})
);

const queryClient = new QueryClient();

beforeAll(() => server.listen());
afterEach(() => {
	server.resetHandlers();
	queryClient.clear();
});
afterAll(() => server.close());

test('should render the selector button with text content', async () => {
	const content = 'Select Reference Data';
	const trackId = 1;
	render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={lightTheme}>
				<ReferenceDataSelector trackId={trackId}>{content}</ReferenceDataSelector>
			</ThemeProvider>
		</QueryClientProvider>
	);

	const button = screen.getByRole('button')
	expect(button).toHaveTextContent(content);
});

test('should display laps when clicked', async () => {
	const content = 'Select Reference Data';
	const trackId = 1;

	render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={lightTheme}>
				<ReferenceDataSelector trackId={trackId}>{content}</ReferenceDataSelector>
			</ThemeProvider>
		</QueryClientProvider>
	);

	const button = screen.getByRole('button')
	fireEvent.click(button);

	const dropdownElements = await screen.findAllByText('driver1', {
		exact: false
	});
	expect(dropdownElements.length).toBeGreaterThan(0);
});

test('should trigger callback when reference data selected', async () => {
	const content = 'Select Reference Data';
	const trackId = 1;

	const callback = jest.fn();

	render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={lightTheme}>
				<ReferenceDataSelector trackId={trackId} onReferenceDataChange={callback}>{content}</ReferenceDataSelector>
			</ThemeProvider>
		</QueryClientProvider>
	);

	const button = screen.getByRole('button')
	fireEvent.click(button);

	const dropdownButton = await screen.findByText('driver1 - 1');
	fireEvent.click(dropdownButton);

	expect(callback).toHaveBeenCalledWith(
		expect.objectContaining({
			trackId,
			driverName: 'driver1'
		})
	);
});