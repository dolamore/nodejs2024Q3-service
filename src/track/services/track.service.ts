import { Inject, Injectable } from '@nestjs/common';
import { TrackRepositoryInterface } from '../interfaces/track.repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from '../dto/create-track.dto';
import { Track } from '../interfaces/track.interface';
import { UpdateTrackInfoDto } from '../dto/update-track-info.dto';
import { AlbumRepositoryInterface } from '../../album/interfaces/album.repository.interface';
import { ArtistRepositoryInterface } from '../../artist/interfaces/artist.repository.interface';
import { FavsRepositoryInterface } from '../../favs/interfaces/favs.repository.interface';

@Injectable()
export class TrackService {
  constructor(
    @Inject('TrackRepositoryInterface')
    private readonly trackRepository: TrackRepositoryInterface,
    @Inject('AlbumRepositoryInterface')
    private readonly albumRepository: AlbumRepositoryInterface,
    @Inject('ArtistRepositoryInterface')
    private readonly artistRepository: ArtistRepositoryInterface,
    @Inject('FavsRepositoryInterface')
    private readonly favsRepository: FavsRepositoryInterface,
  ) {}

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = {
      id: uuidv4(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      albumId: createTrackDto.albumId,
      artistId: createTrackDto.artistId,
    };
    return this.trackRepository.createTrack(track);
  }

  async getAllTracks(): Promise<Track[]> {
    return this.trackRepository.getAllTracks();
  }

  async getTrackById(id: string) {
    return this.trackRepository.getTrackById(id);
  }

  async updateTrackInfo(id: string, updateTrackInfoDto: UpdateTrackInfoDto) {
    return this.trackRepository.updateTrackInfo(id, updateTrackInfoDto);
  }

  async deleteTrack(id: string) {
    await this.favsRepository.deleteTrackFromFavs(id);
    return this.trackRepository.deleteTrack(id);
  }

  async isAlbumExist(id: string) {
    const album = await this.albumRepository.getAlbumById(id);
    return album !== undefined;
  }

  async isArtistExist(id: string) {
    const artist = await this.artistRepository.getArtistById(id);
    return artist !== undefined;
  }
}
