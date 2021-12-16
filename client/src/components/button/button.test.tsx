import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../themes';
import { Button } from './button';

test('renders with text', async () => {
	const buttonContent = 'Test Button'
	render(
		<ThemeProvider theme={lightTheme}>
			<Button>{buttonContent}</Button>
		</ThemeProvider>
	);

	const button = screen.getByRole('button');

	expect(button).toBeInTheDocument();
	expect(button).toHaveTextContent(buttonContent);
})