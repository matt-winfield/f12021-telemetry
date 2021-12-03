import React from 'react'
import styled from 'styled-components';
import { useCarTelemetry, useMotionData } from '../../../hooks/live-data/live-data-selectors';
import WidgetContainer from '../widget-container';
import WheelSlipIndicator from './wheel-slip-indicator';
import { TyreIds } from '../../../../../common/constants/tyre-ids';

const WheelsContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const WheelsRow = styled.div`
	display: flex;
	flex-direction: row;
`

const TyreData = () => {
	const motionData = useMotionData();
	const telemetry = useCarTelemetry();

	return (
		<WidgetContainer>
			<WheelsContainer>
				<WheelsRow>
					<WheelSlipIndicator width={15} height={100} wheelSlipValue={motionData?.m_wheelSlip[TyreIds.FrontLeft]} />
					<WheelSlipIndicator width={15} height={100} wheelSlipValue={motionData?.m_wheelSlip[TyreIds.FrontRight]} />
				</WheelsRow>
				<WheelsRow>
					<WheelSlipIndicator width={15} height={100} wheelSlipValue={motionData?.m_wheelSlip[TyreIds.RearLeft]} />
					<WheelSlipIndicator width={15} height={100} wheelSlipValue={motionData?.m_wheelSlip[TyreIds.RearRight]} />
				</WheelsRow>
			</WheelsContainer>
		</WidgetContainer>
	)
}

export default TyreData;
