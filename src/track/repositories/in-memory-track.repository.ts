import { Injectable } from '@nestjs/common';
import { TrackRepositoryInterface } from '../interfaces/track.repository.interface';
import { Track } from '../interfaces/track.interface';
import { UpdateTrackInfoDto } from '../dto/update-track-info.dto';

@Injectable()
export class InMemoryTrackRepository implements TrackRepositoryInterface {
  private tracks: Track[] = [];

  createTrack(track: Track): Promise<Track> {
    this.tracks.push(track);
    return Promise.resolve(track);
  }

  deleteTrack(id: string): Promise<void> {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index !== -1) {
      this.tracks.splice(index, 1);
    }
    return Promise.resolve(undefined);
  }

  getTrackById(id: string): Promise<Track | undefined> {
    const track = this.tracks.find((track) => track.id === id);
    return Promise.resolve(track);
  }

  getAllTracks(): Promise<Track[]> {
    const tracks = this.tracks;
    return Promise.resolve(tracks);
  }

  updateTrackInfo(
    id: string,
    updateTrackInfoDto: UpdateTrackInfoDto,
  ): Promise<Track> {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      if (updateTrackInfoDto.name) {
        track.name = updateTrackInfoDto.name;
      }
      if (updateTrackInfoDto.duration !== undefined) {
        track.duration = updateTrackInfoDto.duration;
      }
      if (updateTrackInfoDto.artistId !== undefined) {
        track.artistId = updateTrackInfoDto.artistId;
      }
      if (updateTrackInfoDto.albumId !== undefined) {
        track.albumId = updateTrackInfoDto.albumId;
      }
      return Promise.resolve(track);
    }
  }

  deleteAlbumReferences(id: string): Promise<void> {
    this.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    return Promise.resolve(undefined);
  }

  deleteArtistReferences(id: string): Promise<void> {
    this.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    return Promise.resolve(undefined);
  }
}
