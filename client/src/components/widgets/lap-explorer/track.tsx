import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
	border: 1px solid ${props => props.theme.borders.color};
	border-radius: 5px;
	padding: 10px;
	width: fit-content;
	cursor: pointer;
`

type TrackProps = {
	key: number | string;
	name: string;
}

const Track = (props: TrackProps) => {
	return (
		<Container key={props.key}>
			{props.name}
		</Container>
	)
}

export default Track
