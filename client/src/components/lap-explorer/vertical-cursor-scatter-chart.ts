import { ScatterController } from 'chart.js';

export const verticalCursorScatterChartId = 'verticalCursorScatterChart';
export class VerticalCursorScatterChart extends ScatterController {
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