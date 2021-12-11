import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ApplicationRoutes } from '../models/application-routes';
import Button from './button';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin-right: 10px;
	border-right: 1px solid ${props => props.theme.borders.color};
	height: 100%;
`;

const Sidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const activePath = location.pathname.split('/')[1];

	const onDashboardClicked = useCallback(() => {
		navigate(ApplicationRoutes.Dashboard)
	}, [navigate]);

	const onSavedDataClicked = useCallback(() => {
		navigate(ApplicationRoutes.Tracks);
	}, [navigate]);

	const onRawDataClicked = useCallback(() => {
		navigate(ApplicationRoutes.RawData);
	}, [navigate]);

	return (
		<Container>
			<Button selected={activePath === '' || activePath === ApplicationRoutes.Dashboard} onClick={onDashboardClicked}>Live Dashboard</Button>
			<Button selected={activePath === ApplicationRoutes.Tracks || activePath === ApplicationRoutes.Laps} onClick={onSavedDataClicked}>Saved Data</Button>
			<Button selected={activePath === ApplicationRoutes.RawData} onClick={onRawDataClicked}>Raw Data</Button>
		</Container>
	)
}

export default Sidebar;
