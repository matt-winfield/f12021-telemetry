import React from 'react'
import styled from 'styled-components'
import { formatDataValue } from '../logic/format-data-value'

export type DataCellProps = {
	data: any;
}

const DataTable = styled.table`
	padding: 5px;
	border-collapse: collapse;
`

const DataCell = styled.td`
	padding: 5px;
	border: 1px solid grey;
`

const DataDisplay = (props: DataCellProps): JSX.Element => {
	const createCells = (): JSX.Element[] => {
		let cells: JSX.Element[] = [];
		for (const [key, value] of Object.entries(props.data)) {
			cells.push(
				<tr key={key}>
					<DataCell>{key.toString()}</DataCell>
					<DataCell>{formatDataValue(value)}</DataCell>
				</tr>
			)
		}
		return cells;
	}

	if (!props.data) {
		return <div>No data!</div>;
	}

	return <DataTable>
		<tbody>
			{createCells()}
		</tbody>
	</DataTable>
}

export default DataDisplay;
