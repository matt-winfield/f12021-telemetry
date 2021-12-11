import { TrackIds } from '../../../common/model/track-ids';

export default abstract class TrackFormatter {
	private static trackIdMap: { [trackId: number]: string } = {
		[TrackIds.Melbourne]: 'Melbourne',
		[TrackIds.PaulRicard]: 'Paul Ricard',
		[TrackIds.Shanghai]: 'Shanghai',
		[TrackIds.Bahrain]: 'Bahrain - Sakhir',
		[TrackIds.Catalunya]: 'Catalunya',
		[TrackIds.Monaco]: 'Monaco',
		[TrackIds.Montreal]: 'Montreal',
		[TrackIds.Silverstone]: 'Silverstone',
		[TrackIds.Hockenheim]: 'Hockenheim',
		[TrackIds.Hungaroring]: 'Hungaroring',
		[TrackIds.Spa]: 'Spa',
		[TrackIds.Monza]: 'Monza',
		[TrackIds.Singapore]: 'Singapore',
		[TrackIds.Suzuka]: 'Suzuka',
		[TrackIds.AbuDhabi]: 'Abu Dhabi',
		[TrackIds.Texas]: 'Texas',
		[TrackIds.Brazil]: 'Brazil',
		[TrackIds.Austria]: 'Austria',
		[TrackIds.Sochi]: 'Sochi',
		[TrackIds.Mexico]: 'Mexico',
		[TrackIds.Baku]: 'Azerbaijan - Baku',
		[TrackIds.SakhirShort]: 'Sakhir Short',
		[TrackIds.SilverstoneShort]: 'Silverstone Short',
		[TrackIds.TexasShort]: 'Texas Short',
		[TrackIds.SuzukaShort]: 'Suzuka Short',
		[TrackIds.Hanoi]: 'Hanoi',
		[TrackIds.Zandvoort]: 'Zandvoort',
		[TrackIds.Imola]: 'Imola',
		[TrackIds.Portimao]: 'Portimão',
		[TrackIds.Jeddah]: 'Jeddah'
	}

	public static getTrackName = (trackId: number): string => {
		return this.trackIdMap[trackId];
	}
}