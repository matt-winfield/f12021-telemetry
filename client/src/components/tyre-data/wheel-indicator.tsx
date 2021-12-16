import { invert, mix, readableColor } from 'polished'
import { useCallback, useRef } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { roundToDecimalPlaces } from '../../../../common/helpers/number-helpers'
import { ChildrenProps } from '../../types/children-props'
import { clamp, getRatioBetweenValues } from '../../utilities/number-helpers'
import ValueBarContainer, { ValueBarType } from '../data-display/value-bar'

const DEFAULT_WHEEL_TEMP_RANGE_MIN = 70;
const DEFAULT_WHEEL_TEMP_RANGE_MAX = 100;

type WheelIndicatorProps = {
	slipIndicatorWidth: number;
	sideBarIndicatorsWidth: number;
	wheelWidth: number;
	tyreWear?: number;
	tyreSlip?: number;
	tyreSurfaceTemperature?: number;
	tyreInnerTemperature?: number;
	brakeTemperature?: number;
}

const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: row;
	padding: 5px;
`

type WheelProps = ChildrenProps & {
	width: number;
	temperature: number;
	minTemperature?: number;
	maxTemperature?: number;
}

const getWheelColor = (temperature: number, primaryColor: string, secondaryColor: string, minTemperature: number, maxTemperature: number) => {
	const ratio = clamp(getRatioBetweenValues(temperature, minTemperature, maxTemperature), 0, 1);
	return mix(ratio, primaryColor, secondaryColor);
}

const Wheel = styled.div.attrs<WheelProps>(props => {
	const minTemperature = props.minTemperature ?? DEFAULT_WHEEL_TEMP_RANGE_MIN;
	const maxTemperature = props.maxTemperature ?? DEFAULT_WHEEL_TEMP_RANGE_MAX;
	return ({
		style: ({
			'backgroundColor': getWheelColor(props.temperature, props.theme.palette.primary, props.theme.palette.secondary, minTemperature, maxTemperature)
		})
	});
}) <WheelProps>`
	border: 1px solid black;
	border-radius: 10px;
	width: ${props => props.width}px;
	margin: 0 3px;
	position: relative;
`;

const InternalWheel = styled(Wheel) <WheelProps>`
	width: ${props => props.width}px;
	height: 60%;
	position: absolute;
	top: 50%;
	left: 50%;
	margin: 0;
	transform: translate(-50%, -50%);
`

type WheelTextProps = {
	temperature: number;
	minTemperature?: number;
	maxTemperature?: number;
}

const InternalWheelText = styled.div.attrs<WheelTextProps>(props => {
	const minTemperature = props.minTemperature ?? DEFAULT_WHEEL_TEMP_RANGE_MIN;
	const maxTemperature = props.maxTemperature ?? DEFAULT_WHEEL_TEMP_RANGE_MAX;
	const wheelColor = getWheelColor(props.temperature, props.theme.palette.primary, props.theme.palette.secondary, minTemperature, maxTemperature);
	const textColor = readableColor(wheelColor);
	const borderColor = invert(textColor);
	return {
		style: ({
			'color': textColor,
			'textShadow': `-1px -1px 0 ${borderColor}, 1px -1px 0 ${borderColor}, -1px 1px 0 ${borderColor}, 1px 1px 0 ${borderColor}`
		})
	}
}) <WheelTextProps>`
	width: 100%;
	font-size: 13px;
	position: absolute;
	color: ${props => props.color};
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
	pointer-events: none;
`

const SurfaceWheelText = styled(InternalWheelText) <WheelTextProps>`
	top: 2px;
	transform: translateX(-50%);
`;

const BrakeTemperature = styled(Wheel) <WheelProps>`
	border-radius: 0;
`

const BrakeTemperatureText = styled(InternalWheelText) <WheelTextProps>`
	top: 50%;
	left: 50%;
	width: unset;
	transform: translate(-50%, -50%) rotate(-90deg);
`

const INNER_TEMPERATURE_TOOLTIP_ID = 'inner-temperature-tooltip';
const WHEEL_INDICATOR_TOOLTIP_ID = 'wheel-indicator-tooltip';

const WheelIndicator = (props: WheelIndicatorProps) => {
	const tyreSurfaceTemperatureElementRef = useRef<HTMLDivElement | null>(null);

	const onMouseEnterInnerWheel = useCallback(() => {
		if (tyreSurfaceTemperatureElementRef.current) {
			ReactTooltip.hide(tyreSurfaceTemperatureElementRef.current);
		}
	}, [tyreSurfaceTemperatureElementRef]);

	const onMouseLeaveInnerWheel = useCallback(() => {
		if (tyreSurfaceTemperatureElementRef.current) {
			ReactTooltip.show(tyreSurfaceTemperatureElementRef.current);
		}
	}, [tyreSurfaceTemperatureElementRef]);

	return (
		<Container>
			<ValueBarContainer
				width={props.sideBarIndicatorsWidth}
				value={props.tyreWear}
				min={0}
				max={100}
				type={ValueBarType.Bottom}
				text={`${roundToDecimalPlaces(props.tyreWear ?? 0, 2)}%`}
				invert
				data-tip='Wear'
				data-for={WHEEL_INDICATOR_TOOLTIP_ID} />
			<ValueBarContainer
				width={props.slipIndicatorWidth}
				value={props.tyreSlip}
				min={-1}
				max={1}
				type={ValueBarType.Centered}
				data-tip='Slip'
				data-for={WHEEL_INDICATOR_TOOLTIP_ID} />
			<Wheel
				temperature={props.tyreSurfaceTemperature ?? 0}
				width={props.wheelWidth}
				data-tip='Surface Temperature'
				data-for={WHEEL_INDICATOR_TOOLTIP_ID}
				ref={tyreSurfaceTemperatureElementRef}>
				<SurfaceWheelText temperature={props.tyreSurfaceTemperature ?? 0}>
					{props.tyreSurfaceTemperature && `${props.tyreSurfaceTemperature}°C`}
				</SurfaceWheelText>
				<InternalWheel
					temperature={props.tyreInnerTemperature ?? 0}
					width={props.wheelWidth - 10}
					data-tip='Inner Temperature'
					data-for={INNER_TEMPERATURE_TOOLTIP_ID}
					onMouseEnter={onMouseEnterInnerWheel}
					onMouseLeave={onMouseLeaveInnerWheel}>
					<InternalWheelText temperature={props.tyreInnerTemperature ?? 0}>
						{props.tyreSurfaceTemperature && `${props.tyreInnerTemperature}°C`}
					</InternalWheelText>
				</InternalWheel>
			</Wheel>
			<BrakeTemperature
				width={props.sideBarIndicatorsWidth}
				temperature={props.brakeTemperature ?? 0}
				minTemperature={100}
				maxTemperature={1000}
				data-tip='Brake Temperature'
				data-for={WHEEL_INDICATOR_TOOLTIP_ID}>
				<BrakeTemperatureText
					temperature={props.brakeTemperature ?? 0}
					minTemperature={100}
					maxTemperature={1000}>
					{props.brakeTemperature && `${props.brakeTemperature}°C`}
				</BrakeTemperatureText>
			</BrakeTemperature>
			<ReactTooltip id={INNER_TEMPERATURE_TOOLTIP_ID} effect='solid' />
			<ReactTooltip id={WHEEL_INDICATOR_TOOLTIP_ID} effect='solid' />
		</Container>
	)
}

export default WheelIndicator;
