import { Track } from './track.interface';
import { UpdateTrackInfoDto } from '../dto/update-track-info.dto';

export interface TrackRepositoryInterface {
  getAllTracks(): Promise<Track[]>;

  getTrackById(id: string): Promise<Track | undefined>;

  createTrack(album: Track): Promise<Track>;

  updateTrackInfo(
    id: string,
    updateTrackInfoDto: UpdateTrackInfoDto,
  ): Promise<Track>;

  deleteTrack(id: string): Promise<void>;

  deleteAlbumReferences(id: string): Promise<void>;

  deleteArtistReferences(id: string): Promise<void>;
}
