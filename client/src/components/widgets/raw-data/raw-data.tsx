import { useState } from 'react';
import Tabs from '../../tabs';
import RawCarDamageData from './raw-car-damage-data';
import RawCarSetupsData from './raw-car-setups-data';
import RawCarStatus from './raw-car-status';
import RawCarTelemetry from './raw-car-telemetry';
import RawEventData from './raw-event-data';
import RawFinalClassificationData from './raw-final-classification-data';
import RawLapData from './raw-lap-data';
import RawLobbyInfo from './raw-lobby-info';
import RawMotionData from './raw-motion-data';
import RawParticipantsData from './raw-participants-data';
import RawSessionData from './raw-session-data';
import RawSessionHistory from './raw-session-history';

const dataTabs = ["Motion", "Session", "Lap Data", "Event", "Participants", "Car Setups", "Car Telemetry", "Car Status", "Final Classification", "Lobby Info", "Car Damage", "Session History"];

const RawData = () => {
	const [selectedTab, setSelectedTab] = useState(0);

	const getContent = () => {
		switch (selectedTab) {
			case 0:
				return <RawMotionData />
			case 1:
				return <RawSessionData />
			case 2:
				return <RawLapData />
			case 3:
				return <RawEventData />
			case 4:
				return <RawParticipantsData />;
			case 5:
				return <RawCarSetupsData />;
			case 6:
				return <RawCarTelemetry />;
			case 7:
				return <RawCarStatus />;
			case 8:
				return <RawFinalClassificationData />;
			case 9:
				return <RawLobbyInfo />;
			case 10:
				return <RawCarDamageData />;
			case 11:
				return <RawSessionHistory />;
		}
		return undefined;
	}

	return (
		<div>
			<Tabs tabs={dataTabs} onClick={setSelectedTab}></Tabs>
			{getContent()}
		</div>
	)
}

export default RawData;
