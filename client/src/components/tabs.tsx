import React, { useState } from 'react'
import styled from 'styled-components'
import Tab from './tab'

export type TabsProps = {
	tabs: string[];
	onClick?: (id: number) => void;
}

const TabsContainer = styled.div`
	display: flex;
	flex-direction: row;
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
				<Tab key={index} index={index} onClick={handleClick} selected={index === selectedTab}>{tab}</Tab>
			)}
		</TabsContainer>
	)
}

export default React.memo(Tabs);
