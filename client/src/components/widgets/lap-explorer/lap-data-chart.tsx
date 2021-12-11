import React, { useCallback, useState } from 'react';
import { Label, Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import Button from '../../button';

export type ChartValue = {
	lapDistance: number;
	value: number;
}

const Container = styled.div`
	display: flex;
	align-items: flex-start;
`

type LapDataChartProps = {
	data: ChartValue[];
	xAxisLabel: string;
	yAxisLabel: string;
	xAxisUnit?: string;
	yAxisUnit?: string;
}

const LapDataChart = ({ data, xAxisLabel, yAxisLabel, xAxisUnit, yAxisUnit }: LapDataChartProps) => {
	const [referenceAreaLeft, setReferenceAreaLeft] = useState('');
	const [referenceAreaRight, setReferenceAreaRight] = useState('');
	const [left, setLeft] = useState('dataMin');
	const [right, setRight] = useState('dataMax');

	const onMouseDown = useCallback((e: any) => {
		setReferenceAreaLeft(e.activeLabel);
	}, []);

	const onMouseMove = useCallback((e: any) => {
		setReferenceAreaRight(e.activeLabel);
	}, []);

	const onMouseUp = useCallback((e: any) => {
		let newLeft = referenceAreaLeft;
		let newRight = referenceAreaRight;

		if (newLeft === newRight || newRight === '') {
			setReferenceAreaLeft('');
			setReferenceAreaRight('');
			return;
		}

		if (newLeft > newRight) {
			[newLeft, newRight] = [newRight, newLeft];
		}

		setReferenceAreaLeft('');
		setReferenceAreaRight('');
		setLeft(newLeft);
		setRight(newRight);
	}, [referenceAreaLeft, referenceAreaRight]);

	const resetZoom = useCallback(() => {
		setLeft('dataMin');
		setRight('dataMax');
	}, [])

	const formatTickLabel = useCallback((value: any) => `${value}${xAxisUnit ?? ''}`, [xAxisUnit])

	const formatTooltipLabel = useCallback((label: any) => `${xAxisLabel}: ${label}${xAxisUnit ?? ''}`, [xAxisLabel, xAxisUnit])

	const formatTooltip = useCallback((value: any) => `${value}${yAxisUnit ?? ''}`, [yAxisUnit])

	return (
		<Container>
			<LineChart
				width={800}
				height={400}
				data={data}
				margin={{ top: 0, left: 30, right: 0, bottom: 30 }}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}>
				<XAxis allowDataOverflow dataKey='lapDistance' type='number' tickCount={10} tickFormatter={formatTickLabel} domain={[left, right]}>
					<Label dy={15}>{xAxisLabel}</Label>
				</XAxis>
				<YAxis yAxisId='1'>
					<Label angle={270} dx={-20}>{yAxisLabel}</Label>
				</YAxis>
				<Line type='monotone' dataKey='value' yAxisId='1' dot={false} animationDuration={0} />
				<Tooltip labelFormatter={formatTooltipLabel} formatter={formatTooltip} />
				{referenceAreaLeft && referenceAreaRight &&
					<ReferenceArea yAxisId='1' x1={referenceAreaLeft} x2={referenceAreaRight} />}
			</LineChart>
			<Button onClick={resetZoom}>Reset Zoom</Button>
		</Container>
	)
}

export default LapDataChart
