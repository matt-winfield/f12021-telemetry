import React, { useCallback } from 'react'
import styled from 'styled-components';
import { Page } from '../models/page';
import Tabs, { TabsContainer } from './tabs';

export type SidebarProps = {
	onChange?: (newPage: Page) => void;
	defaultPage?: Page;
}

const Container = styled.div`
	${TabsContainer} {
		display: flex;
		flex-direction: column;
		padding: 10px;
		margin-right: 10px;
		border-right: 1px solid ${props => props.theme.borders.color};
		height: 100%;
	}
`;

const Sidebar = ({ onChange, defaultPage }: SidebarProps) => {
	const tabs = ["Live Dashboard", "Raw Data"];

	const onTabClicked = useCallback((index: number) => {
		onChange?.(index);
	}, [onChange]);

	return (
		<Container>
			<Tabs tabs={tabs} onClick={onTabClicked} default={defaultPage}></Tabs>
		</Container>
	)
}

export default Sidebar;
