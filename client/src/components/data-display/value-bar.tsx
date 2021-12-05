import React from 'react'
import styled, { useTheme } from 'styled-components'
import { clamp, getRatioBetweenValues } from '../../utilities/number-helpers';
import { invert, readableColor } from 'polished';
import { ChildrenProps } from '../../types/children-props';

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
	color?: string;
	text?: string;
	invert?: boolean;
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
	return 100 * getRatioBetweenValues(value, min, max);
}

const getBarHeightPercentage = (type: ValueBarType, nullableValue: number | undefined, min: number, max: number, invert: boolean): number => {
	const value = clamp(nullableValue ?? 0, min, max);
	const percentage = type === ValueBarType.Centered
		? getPercentageComplete(value, min, max) - 50
		: getPercentageComplete(value, min, max);
	return invert
		? 100 - percentage
		: percentage;
}

const getOffetStyle = (type: ValueBarType, nullableValue: number | undefined, min: number, max: number, invert: boolean): Partial<{ top: string, bottom: string }> => {
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
	return { top: `${50 + getBarHeightPercentage(type, value, min, max, invert)}%` };
}

const ValueBar = styled.div.attrs<ValueBarContainerProps>(props => ({
	style: ({
		height: `${Math.abs(getBarHeightPercentage(props.type, props.value, props.min, props.max, props.invert ?? false))}%`,
		...getOffetStyle(props.type, props.value, props.min, props.max, props.invert ?? false)
	})
})) <ValueBarContainerProps>`
	position: absolute;
	left: 0;
	width: 100%;
	background-color: ${props => props.color ?? props.theme.palette.primary};
`;

const CenterLine = styled.div`
	position: absolute;
	top: 50%;
	width: 100%;
	background-color: ${props => props.theme.borders.color};
	height: 1px;
	opacity: 0.5;
`

const Text = styled.div<{ width: number, color: string } & ChildrenProps>`
	font-size: ${props => props.width - 2}px;
	position: absolute;
	color: ${props => props.color};
	text-shadow: ${props => `-1px -1px 0 ${invert(props.color)}, 1px -1px 0 ${invert(props.color)}, -1px 1px 0 ${invert(props.color)}, 1px 1px 0 ${invert(props.color)}`};
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) rotate(-90deg);
	white-space: nowrap;
	pointer-events: none;
`

const ValueBarContainer = (props: ValueBarContainerProps) => {
	const theme = useTheme();

	return (
		<Container {...props}>
			{props.type === ValueBarType.Centered
				&& <CenterLine />}
			<ValueBar {...props} />
			{props.text
				&& <Text width={props.width} color={readableColor(props.color ?? theme.palette.primary)}>{props.text}</Text>
			}
		</Container>
	)
}

export default ValueBarContainer;
