import styled from 'styled-components';

const WidgetContainer = styled.div`
	padding: 10px;
	border-radius: 10px;
	border: 1px solid ${props => props.theme.borders.color};
	width: fit-content;
`

export default WidgetContainer;
