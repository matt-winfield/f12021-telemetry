import React from 'react'
import { Label, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

export type ChartValue = {
	lapDistance: number;
	value: number;
}

type LapDataChartProps = {
	data: ChartValue[];
	xAxisLabel: string;
	yAxisLabel: string;
}

const LapDataChart = ({ data, xAxisLabel, yAxisLabel }: LapDataChartProps) => {
	return (
		<LineChart width={800} height={400} data={data} margin={{ top: 0, left: 30, right: 0, bottom: 30 }}>
			<Line type='monotone' dataKey='value' dot={false} />
			<XAxis dataKey='lapDistance'>
				<Label dy={15}>{xAxisLabel}</Label>
			</XAxis>
			<YAxis>
				<Label angle={270} dx={-10}>{yAxisLabel}</Label>
			</YAxis>
			<Tooltip />
		</LineChart>
	)
}

export default LapDataChart
