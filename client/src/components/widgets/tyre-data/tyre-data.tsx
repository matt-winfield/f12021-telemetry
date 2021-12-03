import React from 'react'
import styled from 'styled-components';
import { useCarTelemetry, useMotionData } from '../../../hooks/live-data/live-data-selectors';
import WidgetContainer from '../widget-container';
import { TyreIds } from '../../../../../common/constants/tyre-ids';
import WheelIndicator from './wheel-indicator';

const WheelsContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const WheelsRow = styled.div`
	display: flex;
	flex-direction: row;
	height: 100px;
	margin: 1px 0;
`

const TyreData = () => {
	const motionData = useMotionData();
	const telemetry = useCarTelemetry();
	const playerCarIndex = telemetry?.m_header.m_playerCarIndex;

	return (
		<WidgetContainer>
			<WheelsContainer>
				<WheelsRow>
					<WheelIndicator
						wheelWidth={50}
						slipIndicatorWidth={8}
						pressureIndicatorWidth={17}
						tyreSlip={motionData?.m_wheelSlip[TyreIds.FrontLeft]}
						tyrePressure={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresPressure[TyreIds.FrontLeft]}
						tyreInnerTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresInnerTemperature[TyreIds.FrontLeft]}
						tyreSurfaceTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresSurfaceTemperature[TyreIds.FrontLeft]}
					/>
					<WheelIndicator
						wheelWidth={50}
						slipIndicatorWidth={8}
						pressureIndicatorWidth={17}
						tyreSlip={motionData?.m_wheelSlip[TyreIds.FrontRight]}
						tyrePressure={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresPressure[TyreIds.FrontRight]}
						tyreInnerTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresInnerTemperature[TyreIds.FrontRight]}
						tyreSurfaceTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresSurfaceTemperature[TyreIds.FrontRight]}
					/>
				</WheelsRow>
				<WheelsRow>
					<WheelIndicator
						wheelWidth={50}
						slipIndicatorWidth={8}
						pressureIndicatorWidth={17}
						tyreSlip={motionData?.m_wheelSlip[TyreIds.RearLeft]}
						tyrePressure={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresPressure[TyreIds.RearLeft]}
						tyreInnerTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresInnerTemperature[TyreIds.RearLeft]}
						tyreSurfaceTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresSurfaceTemperature[TyreIds.RearLeft]}
					/>
					<WheelIndicator
						wheelWidth={50}
						slipIndicatorWidth={8}
						pressureIndicatorWidth={17}
						tyreSlip={motionData?.m_wheelSlip[TyreIds.RearRight]}
						tyrePressure={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresPressure[TyreIds.RearRight]}
						tyreInnerTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresInnerTemperature[TyreIds.RearRight]}
						tyreSurfaceTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresSurfaceTemperature[TyreIds.RearRight]}
					/>
				</WheelsRow>
			</WheelsContainer>
		</WidgetContainer>
	)
}

export default TyreData;
