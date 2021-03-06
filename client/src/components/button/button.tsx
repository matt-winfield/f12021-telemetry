import React, { useCallback } from "react";
import styled from "styled-components";

type ButtonProps = {
	selected?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
	className?: string;
}

const Container = styled.button<{ selected: boolean }>`
	display: inline-block;
	padding: 5px 7px;
	margin: 2px;
	color: ${props => props.selected ? props.theme.button.selectedTextColor : props.theme.button.textColor};
	background-color: ${props => props.selected ? props.theme.button.selected : props.theme.button.normal};
	cursor: pointer;
	border: 1px solid ${props => props.theme.borders.color};
	border-radius: 3px;
	font-size: 1rem;

	&:hover {
		background-color: ${props => props.selected ? props.theme.button.selectedHover : props.theme.button.hover};
	}
`

export const Button = React.memo(({ onClick, selected, children, className }: ButtonProps) => {
	const handleClick = useCallback(() => {
		onClick?.();
	}, [onClick]);

	return (
		<Container selected={selected ?? false} onClick={handleClick} className={className}>
			{children}
		</Container>
	)
});
