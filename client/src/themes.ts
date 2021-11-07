import { DefaultTheme } from "styled-components";

declare module 'styled-components' {
	export interface DefaultTheme {
		button: {
			normal: string;
			selected: string;
			hover: string;
		}
	}
}

export const lightTheme: DefaultTheme = {
	button: {
		normal: 'white',
		selected: 'rgb(220, 0, 0)',
		hover: 'rgb(255, 70, 70)'
	}
}