import { DefaultTheme } from "styled-components";

declare module 'styled-components' {
	export interface DefaultTheme {
		button: {
			normal: string;
			selected: string;
			hover: string;
			selectedHover: string;
			textColor: string;
			selectedTextColor: string;
		},
		borders: {
			color: string
		},
		palette: {
			primary: string
		}
	}
}

const lightPrimary = 'rgb(220, 0, 0)';
export const lightTheme: DefaultTheme = {
	button: {
		normal: 'white',
		selected: lightPrimary,
		hover: 'rgb(220, 220, 220)',
		selectedHover: 'rgb(255, 70, 70)',
		textColor: 'black',
		selectedTextColor: 'white'
	},
	borders: {
		color: 'grey'
	},
	palette: {
		primary: lightPrimary
	}
}