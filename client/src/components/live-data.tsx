import { useState } from 'react';
import { useMotionData, useSessionData } from '../hooks/selectors/live-data-selectors';
import useLiveDataConnection from '../hooks/use-live-data-connection';
import DataDisplay from './data-display';
import Tabs from './tabs';

const dataTabs = ["Motion", "Session", "Lap Data", "Event", "Participants", "Car Setups", "Car Telemetry", "Car Status", "Final Classification", "Lobby Info", "Car Damage", "Session History"];

const LiveData = () => {
	useLiveDataConnection();
	const motionData = useMotionData();
	const sessionData = useSessionData();
	const [selectedTab, setSelectedTab] = useState(0);

	const getLiveData = () => {
		switch (selectedTab) {
			case 0:
				return motionData;
			case 1:
				return sessionData;
		}
		return undefined;
	}

	return (
		<div>
			<Tabs tabs={dataTabs} onClick={(tabId) => setSelectedTab(tabId)}></Tabs>
			<DataDisplay data={getLiveData()}></DataDisplay>
		</div>
	)
}

export default LiveData;
