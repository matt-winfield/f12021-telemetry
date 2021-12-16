import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { StoreState } from '../../store';

export type Coordinate = {
	x: number;
	y: number;
}

type TrackMapProps = {
	data: { [lapDistance: number]: Coordinate }
}

const StyledSvg = styled.svg`
	max-height: 500px;
`

const TrackMap = ({ data }: TrackMapProps) => {
	const zoomStart = useSelector((state: StoreState) => state.charts.zoomStart);
	const zoomEnd = useSelector((state: StoreState) => state.charts.zoomEnd);

	const [path, viewBox] = useMemo(() => {
		let output = '';

		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		let firstCoordinate = true;
		Object.keys(data).forEach((key) => {
			let lapDistance = Number(key);
			const dataPoint = data[lapDistance];

			if (dataPoint.x === 0 && dataPoint.y === 0) return;

			output += `${firstCoordinate ? 'M' : 'L'} ${dataPoint.x} ${dataPoint.y} `;
			firstCoordinate = false;

			if ((zoomStart === undefined || zoomEnd === undefined) || (lapDistance >= zoomStart && lapDistance <= zoomEnd)) {
				minX = Math.min(dataPoint.x, minX);
				minY = Math.min(dataPoint.y, minY);
				maxX = Math.max(dataPoint.x, maxX);
				maxY = Math.max(dataPoint.y, maxY);
			}
		});

		return [output + 'Z', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`];
	}, [data, zoomStart, zoomEnd])

	const activeLapDistance = useSelector((state: StoreState) => state.charts.activeLapDistance);
	const activeCoordinate = useMemo(() => activeLapDistance ? data[activeLapDistance] : undefined, [data, activeLapDistance])

	return (
		<StyledSvg viewBox={viewBox}>
			<title>Track Map</title>
			<g stroke='#0037ff' fill='none'>
				<path d={path}></path>
				{activeCoordinate &&
					<circle cx={activeCoordinate.x} cy={activeCoordinate.y} r={5}></circle>
				}
			</g>
		</StyledSvg>
	)
};

export default TrackMap;
