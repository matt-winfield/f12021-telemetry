import React from 'react'
import styled from 'styled-components'
import { clamp } from '../../utilities/number-helpers';

export enum ValueBarType {
	Centered = 'centered',
	Top = 'top',
	Bottom = 'bottom'
}

export type ValueBarContainerProps = {
	width: number;
	value?: number;
	min: number;
	max: number;
	type: ValueBarType;
}

const Container = styled.div<{ width: number }>`
	position: relative;
	width: ${props => props.width}px;
	height: 100%;
	border: 1px solid ${props => props.theme.borders.color};
	border-radius: 2px;
	margin: 1px;
`;

const getPercentageComplete = (value: number, min: number, max: number): number => {
	return 100 * (value - min) / (max - min);
}

const getBarHeightPercentage = (type: ValueBarType, nullableValue: number | undefined, min: number, max: number): number => {
	const value = clamp(nullableValue ?? 0, min, max);
	const percentage = type === ValueBarType.Centered
		? getPercentageComplete(value, min, max) - 50
		: getPercentageComplete(value, min, max);
	return percentage;
}

const getOffetStyle = (type: ValueBarType, nullableValue: number | undefined, min: number, max: number): Partial<{ top: string, bottom: string }> => {
	if (type === ValueBarType.Top) {
		return { top: '0' };
	}

	if (type === ValueBarType.Bottom) {
		return { bottom: '0' };
	}

	const value = clamp(nullableValue ?? 0, min, max);
	const percentage = getPercentageComplete(value, min, max);
	if (percentage >= 50) {
		return { top: '50%' };
	}
	return { top: `${50 + getBarHeightPercentage(type, value, min, max)}%` };
}

const ValueBar = styled.div.attrs<ValueBarContainerProps>(props => ({
	style: ({
		height: `${Math.abs(getBarHeightPercentage(props.type, props.value, props.min, props.max))}%`,
		...getOffetStyle(props.type, props.value, props.min, props.max)
	})
})) <ValueBarContainerProps>`
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

const ValueBarContainer = (props: ValueBarContainerProps) => {
	return (
		<Container width={props.width}>
			<CenterLine />
			<ValueBar {...props} />
		</Container>
	)
}

export default ValueBarContainer;
