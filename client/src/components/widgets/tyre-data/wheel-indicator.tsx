import React from 'react'
import styled from 'styled-components'

type WheelIndicatorProps = {
	width: number;
	tyreSurfaceTemperature: number;
	tyreInnerTemperature: number;
	tyrePressure: number;
}

const Container = styled.div`
	height: 100%;
`

const Wheel = styled.div<{ width: number }>`
	border: 1px solid ${props => props.theme.borders.color};
	border-radius: 10px;
	width: ${props => props.width}px;
`

const WheelIndicator = (props: WheelIndicatorProps) => {
	return (
		<Container>
			<Wheel width={props.width}></Wheel>
		</Container>
	)
}

export default WheelIndicator;
