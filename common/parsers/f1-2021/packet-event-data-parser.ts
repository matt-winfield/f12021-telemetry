import { Parser } from "binary-parser";
import { EventCodes } from "../../constants/event-codes";
import { PacketEventData } from "../../types/packet-event-data";
import IPacketDataParser from "../ipacket-data-parser";
import PacketHeaderParser from "./packet-header-parser";

export default class PacketEventDataParser implements IPacketDataParser {

	public parseMessage(message: Buffer): PacketEventData {
		let header = new PacketEventDataSubParser().parse(message) as PacketEventData;
		let eventCode = header.m_eventStringCode as EventCodes;
		return new PacketEventDataSubParser().setEventData(eventCode).parse(message) as PacketEventData;
	}
}

class PacketEventDataSubParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.nest('m_header', {
				type: new PacketHeaderParser()
			})
			.string('m_eventStringCode', {
				length: 4
			});
	}

	public setEventData(eventCode: EventCodes): PacketEventDataSubParser {
		switch (eventCode) {
			case EventCodes.FastestLap:
				this.nest('m_eventDetails', {
					type: new FastestLapParser()
				});
				break;
			case EventCodes.Retirement:
				this.nest('m_eventDetails', {
					type: new SingleVehicleEventParser()
				});
				break;
			case EventCodes.TeamMateInPits:
				this.nest('m_eventDetails', {
					type: new SingleVehicleEventParser()
				});
				break;
			case EventCodes.RaceWinner:
				this.nest('m_eventDetails', {
					type: new SingleVehicleEventParser()
				});
				break;
			case EventCodes.PenaltyIssued:
				this.nest('m_eventDetails', {
					type: new PenaltyParser()
				});
				break;
			case EventCodes.SpeedTrapTriggered:
				this.nest('m_eventDetails', {
					type: new SpeedTrapParser()
				});
				break;
			case EventCodes.StartLights:
				this.nest('m_eventDetails', {
					type: new StartLightsParser()
				});
				break;
			case EventCodes.DriveThroughServed:
				this.nest('m_eventDetails', {
					type: new SingleVehicleEventParser()
				});
				break;
			case EventCodes.StopGoServed:
				this.nest('m_eventDetails', {
					type: new SingleVehicleEventParser()
				});
				break;
			case EventCodes.Flashback:
				this.nest('m_eventDetails', {
					type: new FlashbackParser()
				});
				break;
			case EventCodes.ButtonStatus:
				this.nest('m_eventDetails', {
					type: new ButtonsParser()
				});
				break;
		}
		return this;
	}
}

class FastestLapParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('vehicleIdx')
			.floatle('lapTime');
	}
}

class SingleVehicleEventParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('vehicleIdx');
	}
}

class PenaltyParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('penaltyType')
			.uint8('infringementType')
			.uint8('vehicleIdx')
			.uint8('otherVehicleIdx')
			.uint8('time')
			.uint8('lapNum')
			.uint8('placesGained');
	}
}

class SpeedTrapParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('vehicleIdx')
			.floatle('speed')
			.uint8('overallFastestInSession')
			.uint8('driverFastestInSession')
	}
}

class StartLightsParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint8('numLights');
	}
}

class FlashbackParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint32('flashbackFrameIdentifier')
			.floatle('flashbackSessionTime');
	}
}

class ButtonsParser extends Parser {
	constructor() {
		super();
		this.endianess('little')
			.uint32('m_buttonStatus');
	}
}