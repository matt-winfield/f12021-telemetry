import React from "react"
import { useCallback } from "react"
import styled from "styled-components"

type TabProps = {
	selected: boolean;
	index: number;
	onClick?: (index: number) => void;
	children: React.ReactNode;
}

const Container = styled.div<{ selected: boolean }>`
	padding: 5px;
	background-color: ${props => props.selected ? props.theme.button.selected : props.theme.button.normal};
	cursor: pointer;
	border: 1px solid grey;

	&:hover {
		background-color: ${props => props.theme.button.hover};
	}
`

const Tab = ({ onClick, index, selected, children }: TabProps) => {
	const handleClick = useCallback(() => {
		onClick?.(index);
	}, [onClick, index]);

	return (
		<Container selected={selected} onClick={handleClick}>
			{children}
		</Container>
	)
}

export default React.memo(Tab);
