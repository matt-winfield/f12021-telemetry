import React, { ReactNode, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { ScaleLoader } from 'react-spinners';
import styled from 'styled-components';
import { LapInfo } from '../../../../common/model/lap-info';
import Api from '../../logic/api';
import { Button } from '../button/button';

type ReferenceDataSelectorProps = {
	children?: ReactNode,
	trackId: number;
	onReferenceDataChange?: (lapInfo?: LapInfo) => void;
}

const Container = styled.div`
	position: relative;
	width: 100%;
`

const StyledButton = styled(Button)`
	width: 100%;
`

const Dropdown = styled.div`
	position: absolute;
	top: calc(100% + 3px);
	left: 50%;
	border: 1px solid ${props => props.theme.borders.color};
	border-radius: 5px;
	transform: translateX(-50%);
	width: 100%;
`

const Lap = styled(Button)`
	padding: 5px;
	display: block;
	border: none;
	width: 100%;
	margin: 0;
`

const ReferenceDataSelector = ({ children, trackId, onReferenceDataChange }: ReferenceDataSelectorProps) => {
	const [dropdownDisplayed, setDropdownDisplayed] = useState(false);
	const { isLoading, error, data: laps } = useQuery(['track', trackId], () => Api.fetchTrackLaps(Number(trackId)),
		{
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false
		});

	const onButtonClicked = useCallback(() => {
		setDropdownDisplayed(displayed => !displayed);
	}, [])

	const onReferenceLapClicked = useCallback((lap: LapInfo) => {
		onReferenceDataChange?.(lap);
		setDropdownDisplayed(false);
	}, [onReferenceDataChange])

	return (
		<Container>
			<StyledButton onClick={onButtonClicked}>
				{children}
			</StyledButton>
			{dropdownDisplayed &&
				<Dropdown>
					{isLoading && !error && <ScaleLoader />}
					{!isLoading && !error &&
						laps?.map((lap, index) => <Lap key={index} onClick={() => onReferenceLapClicked(lap)}>{lap.driverName} - {lap.lapNumber}</Lap>)
					}
				</Dropdown>}
		</Container>
	)
};

export default ReferenceDataSelector;
