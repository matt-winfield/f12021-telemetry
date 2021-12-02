import { useSelector } from "react-redux";
import { StoreState } from "../../store";

export const useMotionData = () => {
	return useSelector((state: StoreState) => state.liveData.motion);
}

export const useSessionData = () => {
	return useSelector((state: StoreState) => state.liveData.session);
}

export const useLapData = () => {
	return useSelector((state: StoreState) => state.liveData.lap);
}

export const useEventData = () => {
	return useSelector((state: StoreState) => state.liveData.event);
}

export const useParticipantsData = () => {
	return useSelector((state: StoreState) => state.liveData.participants);
}

export const useCarSetups = () => {
	return useSelector((state: StoreState) => state.liveData.carSetups);
}

export const useCarTelemetry = () => {
	return useSelector((state: StoreState) => state.liveData.carTelemetry);
}

export const useCarStatus = () => {
	return useSelector((state: StoreState) => state.liveData.carStatus);
}

export const useFinalClassificationData = () => {
	return useSelector((state: StoreState) => state.liveData.finalClassification);
}

export const useLobbyInfo = () => {
	return useSelector((state: StoreState) => state.liveData.lobbyInfo);
}

export const useCarDamageData = () => {
	return useSelector((state: StoreState) => state.liveData.carDamage);
}

export const useSessionHistory = () => {
	return useSelector((state: StoreState) => state.liveData.sessionHistory);
}