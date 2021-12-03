import { invert, mix, readableColor } from 'polished'
import styled, { useTheme } from 'styled-components'
import { ChildrenProps } from '../../../types/children-props'
import { clamp, getRatioBetweenValues } from '../../../utilities/number-helpers'
import ValueBarContainer, { ValueBarType } from '../../data-display/value-bar'

const WHEEL_TEMP_RANGE_MIN = 70;
const WHEEL_TEMP_RANGE_MAX = 100;

type WheelIndicatorProps = {
	slipIndicatorWidth: number;
	pressureIndicatorWidth: number;
	wheelWidth: number;
	tyreSlip?: number;
	tyreSurfaceTemperature?: number;
	tyreInnerTemperature?: number;
	tyrePressure?: number;
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
}

const getWheelColor = (temperature: number, primaryColor: string, secondaryColor: string) => {
	const ratio = clamp(getRatioBetweenValues(temperature, WHEEL_TEMP_RANGE_MIN, WHEEL_TEMP_RANGE_MAX), 0, 1);
	console.log(ratio);
	return mix(ratio, primaryColor, secondaryColor);
}

const Wheel = styled.div.attrs<WheelProps>(props => ({
	style: ({
		'backgroundColor': getWheelColor(props.temperature, props.theme.palette.primary, props.theme.palette.secondary)
	})
})) <WheelProps>`
	border: 1px solid ${props => props.theme.borders.color};
	border-radius: 10px;
	width: ${props => props.width}px;
	margin: 0 3px;
	position: relative;
`;

type WheelTextProps = {
	temperature: number;
}

const InternalWheelText = styled.div.attrs<WheelTextProps>(props => {
	const wheelColor = getWheelColor(props.temperature, props.theme.palette.primary, props.theme.palette.secondary);
	console.log(wheelColor);
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
`

const WheelIndicator = (props: WheelIndicatorProps) => {
	const theme = useTheme();

	return (
		<Container>
			<ValueBarContainer
				width={props.slipIndicatorWidth}
				value={props.tyreSlip}
				min={-1}
				max={1}
				type={ValueBarType.Centered} />
			<Wheel temperature={props.tyreSurfaceTemperature ?? 0} width={props.wheelWidth}>
				<InternalWheelText temperature={props.tyreSurfaceTemperature ?? 0}>
					{props.tyreSurfaceTemperature && `${props.tyreSurfaceTemperature}°C`}
				</InternalWheelText>
			</Wheel>
			<ValueBarContainer
				width={props.pressureIndicatorWidth}
				value={props.tyrePressure}
				min={20}
				max={25}
				type={ValueBarType.Bottom}
				color={theme.palette.secondary}
				text={`${Math.round(props.tyrePressure ?? 0)} PSI`} />
		</Container>
	)
}

export default WheelIndicator;
