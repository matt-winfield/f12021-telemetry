import React from 'react'
import styled from 'styled-components';
import { useCarTelemetry, useMotionData } from '../../../hooks/live-data/live-data-selectors';
import WidgetContainer from '../widget-container';
import { TyreIds } from '../../../../../common/constants/tyre-ids';
import ValueBarContainer, { ValueBarType } from '../../data-display/value-bar';

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

	return (
		<WidgetContainer>
			<WheelsContainer>
				<WheelsRow>
					<ValueBarContainer width={15} value={motionData?.m_wheelSlip[TyreIds.FrontLeft]} min={-1} max={1} type={ValueBarType.Centered} />
					<ValueBarContainer width={15} value={motionData?.m_wheelSlip[TyreIds.FrontRight]} min={-1} max={1} type={ValueBarType.Centered} />
				</WheelsRow>
				<WheelsRow>
					<ValueBarContainer width={15} value={motionData?.m_wheelSlip[TyreIds.RearLeft]} min={-1} max={1} type={ValueBarType.Centered} />
					<ValueBarContainer width={15} value={motionData?.m_wheelSlip[TyreIds.RearRight]} min={-1} max={1} type={ValueBarType.Centered} />
				</WheelsRow>
			</WheelsContainer>
		</WidgetContainer>
	)
}

export default TyreData;
