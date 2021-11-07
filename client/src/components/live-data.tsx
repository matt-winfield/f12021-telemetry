import React from 'react'
import styled from 'styled-components';
import { useMotionData } from '../hooks/selectors/live-data-selectors';
import useLiveDataConnection from '../hooks/use-live-data-connection';

const DataCell = styled.div`
	display: flex;
	flex-direction: row;
`

const LiveData = () => {
	useLiveDataConnection();
	const motionData = useMotionData();

	const createMotionDataCells = (): JSX.Element[] => {
		if (!motionData) {
			return [];
		}

		let cells: JSX.Element[] = [];
		for (const [key, value] of Object.entries(motionData)) {
			cells.push(
				<DataCell>
					<div>{key.toString()}</div>
					<div>{value.toString()}</div>
				</DataCell>
			)
		}
		return cells;
	}

	return (
		<div>
			{createMotionDataCells()}
		</div>
	)
}

export default LiveData;
