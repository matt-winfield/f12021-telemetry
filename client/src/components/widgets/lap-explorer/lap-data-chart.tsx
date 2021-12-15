import { CategoryScale, Chart, ChartData, InteractionModeMap, Legend, LinearScale, LineElement, PointElement, ScatterController, Title, Tooltip } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Mode } from 'chartjs-plugin-zoom/types/options';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	width: 100%;
	height: 500px;
	position: relative;
`

export type ChartDataPoint = {
	x: number;
	y: number;
}

type LapDataChartProps = {
	dataSets: ChartDataPoint[][];
	lineNames: string[];
	yAxisLabel: string;
	yAxisUnit?: string;
}

const lineColors = ['#0037ff', '#ff4b4b', '#09ff00', '#6600ff', '#24b6ff', '#ff47a6', '#b0ff4f', '#d400ff']

const verticalCursorScatterChartId = 'verticalCursorScatterChart';
class VerticalCursorScatterChart extends ScatterController {
	public static id: string = verticalCursorScatterChartId;
	public static defaults = ScatterController.defaults;

	public draw = (): void => {
		super.draw();

		const activeElements = this.chart.tooltip?.getActiveElements();

		if (activeElements !== undefined && activeElements.length > 0) {
			let activePoint = activeElements[0],
				ctx = this.chart.ctx,
				x = activePoint.element.tooltipPosition().x,
				topY = this.chart.scales['y']?.top,
				bottomY = this.chart.scales['y']?.bottom;

			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x, topY);
			ctx.lineTo(x, bottomY);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#38acff39';
			ctx.stroke();
			ctx.restore();
		}
	}
}

declare module 'chart.js' {
	interface ChartTypeRegistry {
		[verticalCursorScatterChartId]: ChartTypeRegistry['scatter']
	}
}

Chart.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	VerticalCursorScatterChart,
	zoomPlugin
);

const options = {
	responsive: true,
	maintainAspectRatio: false,
	layout: {
		padding: 20
	},
	elements: {
		point: {
			radius: 0
		},
		line: {
			tension: 0,
			borderWidth: 1
		}
	},
	tooltips: {
		axis: 'x'
	},
	interaction: {
		mode: 'index' as keyof InteractionModeMap,
		intersect: false
	},
	plugins: {
		legend: {
			position: 'bottom' as const
		},
		zoom: {
			pan: {
				enabled: true,
				mode: 'x' as Mode
			},
			zoom: {
				wheel: {
					enabled: true,
					modifierKey: 'ctrl' as const
				},
				pinch: {
					enabled: true
				},
				drag: {
					enabled: true,
					modifierKey: 'ctrl' as const
				},
				mode: 'x' as Mode
			},
			limits: {
				x: { min: 'original' as const, max: 'original' as const }
			}
		}
	}
};

const LapDataChart = ({ dataSets, lineNames, yAxisLabel, yAxisUnit }: LapDataChartProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const chartRef = useRef<Chart>();

	useEffect(() => {
		const data: ChartData = {
			datasets: []
		}

		dataSets.forEach((dataSet, index) => {
			data.datasets.push({
				label: lineNames[index],
				data: dataSet,
				showLine: true,
				borderColor: lineColors[index % 7],
				backgroundColor: lineColors[index % 7]
			})
		})

		if (canvasRef.current) {
			chartRef.current = new Chart(canvasRef.current, {
				type: verticalCursorScatterChartId,
				data,
				options
			});
		}

		return () => {
			chartRef.current?.destroy();
		}
	}, [dataSets, lineNames])

	return (
		<Container>
			<canvas ref={canvasRef}></canvas>
		</Container>
	)
}

export default LapDataChart;
