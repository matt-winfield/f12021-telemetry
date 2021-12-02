import { useSelector } from "react-redux";
import { PacketIds } from "../../../common/constants/packet-ids";
import { StoreState } from "../store";

const useSubscribedPackets = (): PacketIds[] => {
	const subscriptions = useSelector((state: StoreState) => state.packetSubscriptions.subscriptions);

	return Object.keys(subscriptions)
		.map(key => Number(key) as PacketIds)
		.filter(packetId => subscriptions[packetId]?.length !== undefined && subscriptions[packetId]?.length! > 0)
}

export default useSubscribedPackets;