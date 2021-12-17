import React, { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { activeLapDistanceAtom, zoomEndAtom, zoomStartAtom } from '../../slices/chart-slice';

export type Coordinate = {
	x: number;
	y: number;
}

type TrackMapProps = {
	lines: { [lapDistance: number]: Coordinate }[],
	padding?: number
}

const StyledSvg = styled.svg`
	max-height: 500px;
`

const lineColors = ['#0037ff', '#ff4b4b', '#09ff00', '#6600ff', '#24b6ff', '#ff47a6', '#b0ff4f', '#d400ff']

const TrackMap = ({ lines, padding }: TrackMapProps) => {
	const [zoomStart] = useRecoilState(zoomStartAtom);
	const [zoomEnd] = useRecoilState(zoomEndAtom);
	const [activeLapDistance] = useRecoilState(activeLapDistanceAtom);
	const activeCoordinates = useMemo(() => activeLapDistance ? lines.map(line => line[activeLapDistance]) : undefined, [lines, activeLapDistance])

	const [paths, viewBox] = useMemo(() => {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		let paths: string[] = []
		for (let line of lines) {
			let path = '';
			let firstCoordinate = true;
			for (let key of Object.keys(line)) {
				let lapDistance = Number(key);
				const dataPoint = line[lapDistance];

				if (dataPoint.x === 0 && dataPoint.y === 0) continue;

				path += `${firstCoordinate ? 'M' : 'L'} ${dataPoint.x} ${dataPoint.y} `;
				firstCoordinate = false;

				if ((zoomStart === null || zoomEnd === null) || (lapDistance >= zoomStart && lapDistance <= zoomEnd)) {
					minX = Math.min(dataPoint.x, minX);
					minY = Math.min(dataPoint.y, minY);
					maxX = Math.max(dataPoint.x, maxX);
					maxY = Math.max(dataPoint.y, maxY);
				}
			};
			path += 'Z';
			paths.push(path);
		}

		return [paths, `${minX - (padding ?? 0)} ${minY - (padding ?? 0)} ${maxX - minX + (padding ?? 0) * 2} ${maxY - minY + (padding ?? 0) * 2}`];
	}, [lines, zoomStart, zoomEnd, padding])

	return (
		<StyledSvg viewBox={viewBox}>
			<title>Track Map</title>
			<g fill='none'>
				{paths.map((path, index) => <path key={index} d={path} stroke={lineColors[index % 8]}></path>)}
				{activeCoordinates &&
					activeCoordinates.map((coordinate, index) =>
						coordinate
							? <circle key={index} cx={coordinate.x} cy={coordinate.y} stroke={lineColors[index % 8]} r={5}></circle>
							: null)
				}
			</g>
		</StyledSvg>
	)
};

export default TrackMap;
