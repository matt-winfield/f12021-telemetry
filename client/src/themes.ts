import { DefaultTheme } from "styled-components";

declare module 'styled-components' {
	export interface DefaultTheme {
		button: {
			normal: string;
			selected: string;
			hover: string;
			selectedHover: string;
		}
	}
}

export const lightTheme: DefaultTheme = {
	button: {
		normal: 'white',
		selected: 'rgb(220, 0, 0)',
		hover: 'rgb(220, 220, 220)',
		selectedHover: 'rgb(255, 70, 70)'
	}
}