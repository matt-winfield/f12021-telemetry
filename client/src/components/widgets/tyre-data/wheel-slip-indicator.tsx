import React from 'react'
import styled from 'styled-components'
import { clamp } from '../../../utilities/number-helpers';

type WheelSlipIndicatorProps = {
	width: number;
	height: number;
	wheelSlipValue?: number;
}

const Container = styled.div<{ width: number, height: number }>`
	position: relative;
	width: ${props => props.width}px;
	height: ${props => props.height}px;
	border: 1px solid ${props => props.theme.borders.color};
	border-radius: 2px;
	margin: 1px;
`;

type ValueBarProps = { value?: number }

const getBarHeightPercentage = (value?: number): string => {
	let absoluteValue = Math.abs(value ?? 0);
	absoluteValue = clamp(absoluteValue, -1, 1);
	return `${absoluteValue * 50}%`
}

const getTopOffset = (nullableValue?: number): string => {
	const value = clamp(nullableValue ?? 0, -1, 1);
	if (value >= 0) {
		return '50%';
	}
	return `${50 + (value * 50)}%`;
}

const ValueBar = styled.div.attrs<ValueBarProps>(props => ({
	style: ({
		height: getBarHeightPercentage(props.value),
		top: getTopOffset(props.value)
	})
})) <ValueBarProps>`
	position: absolute;
	left: 0;
	width: 100%;
	background-color: ${props => props.theme.palette.primary};
`;

const CenterLine = styled.div`
	position: absolute;
	top: 50%;
	width: 100%;
	background-color: ${props => props.theme.borders.color};
	height: 1px;
	opacity: 0.5;
`

const WheelSlipIndicator = ({ width, height, wheelSlipValue }: WheelSlipIndicatorProps) => {
	return (
		<Container width={width} height={height}>
			<CenterLine />
			<ValueBar value={wheelSlipValue} />
		</Container>
	)
}

export default WheelSlipIndicator
