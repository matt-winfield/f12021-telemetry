import { useSelector } from "react-redux";
import { StoreState } from "../../store";

export const useMotionData = () => {
	return useSelector((state: StoreState) => state.liveData.motionData);
}

export const useSessionData = () => {
	return useSelector((state: StoreState) => state.liveData.sessionData);
}

export const useLapData = () => {
	return useSelector((state: StoreState) => state.liveData.lapData);
}