import React from "react"
import { useCallback } from "react"
import styled from "styled-components"

type ButtonProps = {
	selected?: boolean;
	onClick?: () => void;
	children: React.ReactNode;
}

const Container = styled.div<{ selected: boolean }>`
	padding: 5px 7px;
	margin: 2px;
	color: ${props => props.selected ? props.theme.button.selectedTextColor : props.theme.button.textColor};
	background-color: ${props => props.selected ? props.theme.button.selected : props.theme.button.normal};
	cursor: pointer;
	border: 1px solid ${props => props.theme.borders.color};
	border-radius: 3px;

	&:hover {
		background-color: ${props => props.selected ? props.theme.button.selectedHover : props.theme.button.hover};
	}
`

const Button = ({ onClick, selected, children }: ButtonProps) => {
	const handleClick = useCallback(() => {
		onClick?.();
	}, [onClick]);

	return (
		<Container selected={selected ?? false} onClick={handleClick}>
			{children}
		</Container>
	)
}

export default React.memo(Button);
