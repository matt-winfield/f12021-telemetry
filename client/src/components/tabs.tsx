import React, { useState } from 'react'
import styled from 'styled-components'

export type TabsProps = {
	tabs: string[];
	onClick?: (id: number) => void;
}

const TabsContainer = styled.div`
	display: flex;
	flex-direction: row;
`

type TabProps = {
	selected: boolean;
}

const Tab = styled.div<TabProps>`
	padding: 5px;
	background-color: ${props => props.selected ? 'red' : 'white'};
	cursor: pointer;
	border: 1px solid grey;
`

const Tabs = (props: TabsProps) => {
	const [selectedTab, setSelectedTab] = useState(0);

	const handleClick = (id: number) => {
		props.onClick?.(id);
		setSelectedTab(id);
	}

	return (
		<TabsContainer>
			{props.tabs.map((tab, index) =>
				<Tab key={index} onClick={() => handleClick(index)} selected={index === selectedTab}>{tab}</Tab>
			)}
		</TabsContainer>
	)
}

export default Tabs
