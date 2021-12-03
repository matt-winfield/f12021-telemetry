import { isNumeric } from "../../../common/helpers/string-helpers";
import ArrayDataDisplay from "../components/data-display/array-data-display";
import DataDisplay from "../components/data-display/data-display";

export const formatDataValue = (value: any): JSX.Element | string | number => {
	if (typeof value === 'string') {
		return value;
	}

	if (Array.isArray(value)) {
		return <ArrayDataDisplay data={value}></ArrayDataDisplay>
	}

	if (!isNumeric(value)) {
		return <DataDisplay data={value}></DataDisplay>
	}

	return +Number(value).toFixed(3);
}