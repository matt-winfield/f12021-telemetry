import React from 'react'
import styled from 'styled-components';
import { useCarDamageData, useCarTelemetry, useMotionData } from '../../../hooks/live-data/live-data-selectors';
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
	const damage = useCarDamageData();
	const playerCarIndex = telemetry?.m_header.m_playerCarIndex;

	return (
		<WidgetContainer>
			<WheelsContainer>
				<WheelsRow>
					<WheelIndicator
						wheelWidth={50}
						slipIndicatorWidth={8}
						sideBarIndicatorsWidth={17}
						tyreWear={damage?.m_carDamageData?.[playerCarIndex ?? 0].m_tyresWear[TyreIds.FrontLeft]}
						tyreSlip={motionData?.m_wheelSlip[TyreIds.FrontLeft]}
						brakeTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_brakesTemperature[TyreIds.FrontLeft]}
						tyreInnerTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresInnerTemperature[TyreIds.FrontLeft]}
						tyreSurfaceTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresSurfaceTemperature[TyreIds.FrontLeft]}
					/>
					<WheelIndicator
						wheelWidth={50}
						slipIndicatorWidth={8}
						sideBarIndicatorsWidth={17}
						tyreWear={damage?.m_carDamageData?.[playerCarIndex ?? 0].m_tyresWear[TyreIds.FrontRight]}
						tyreSlip={motionData?.m_wheelSlip[TyreIds.FrontRight]}
						brakeTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_brakesTemperature[TyreIds.FrontRight]}
						tyreInnerTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresInnerTemperature[TyreIds.FrontRight]}
						tyreSurfaceTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresSurfaceTemperature[TyreIds.FrontRight]}
					/>
				</WheelsRow>
				<WheelsRow>
					<WheelIndicator
						wheelWidth={50}
						slipIndicatorWidth={8}
						sideBarIndicatorsWidth={17}
						tyreWear={damage?.m_carDamageData?.[playerCarIndex ?? 0].m_tyresWear[TyreIds.RearLeft]}
						tyreSlip={motionData?.m_wheelSlip[TyreIds.RearLeft]}
						brakeTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_brakesTemperature[TyreIds.RearLeft]}
						tyreInnerTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresInnerTemperature[TyreIds.RearLeft]}
						tyreSurfaceTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresSurfaceTemperature[TyreIds.RearLeft]}
					/>
					<WheelIndicator
						wheelWidth={50}
						slipIndicatorWidth={8}
						sideBarIndicatorsWidth={17}
						tyreWear={damage?.m_carDamageData?.[playerCarIndex ?? 0].m_tyresWear[TyreIds.RearRight]}
						tyreSlip={motionData?.m_wheelSlip[TyreIds.RearRight]}
						brakeTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_brakesTemperature[TyreIds.RearRight]}
						tyreInnerTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresInnerTemperature[TyreIds.RearRight]}
						tyreSurfaceTemperature={telemetry?.m_carTelemetryData?.[playerCarIndex ?? 0].m_tyresSurfaceTemperature[TyreIds.RearRight]}
					/>
				</WheelsRow>
			</WheelsContainer>
		</WidgetContainer>
	)
}

export default TyreData;
