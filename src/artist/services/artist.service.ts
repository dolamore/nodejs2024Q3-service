import { Inject, Injectable } from '@nestjs/common';
import { ArtistRepositoryInterface } from '../interfaces/artist.repository.interface';
import { Artist } from '../interfaces/artist.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistInfoDto } from '../dto/update-artist-info.dto';
import { AlbumRepositoryInterface } from '../../album/interfaces/album.repository.interface';
import { TrackRepositoryInterface } from '../../track/interfaces/track.repository.interface';
import { FavsRepositoryInterface } from '../../favs/interfaces/favs.repository.interface';

@Injectable()
export class ArtistService {
  constructor(
    @Inject('ArtistRepositoryInterface')
    private readonly artistRepository: ArtistRepositoryInterface,
    @Inject('AlbumRepositoryInterface')
    private readonly albumRepository: AlbumRepositoryInterface,
    @Inject('TrackRepositoryInterface')
    private readonly trackRepository: TrackRepositoryInterface,
    @Inject('FavsRepositoryInterface')
    private readonly favsRepository: FavsRepositoryInterface,
  ) {}

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    return this.artistRepository.createArtist(artist);
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.artistRepository.getAllArtists();
  }

  async getArtistById(id: string) {
    return this.artistRepository.getArtistById(id);
  }

  async updateArtistInfo(id: string, updateArtistInfoDto: UpdateArtistInfoDto) {
    return this.artistRepository.updateArtistInfo(id, updateArtistInfoDto);
  }

  async deleteArtist(id: string) {
    await this.albumRepository.deleteArtistReferences(id);
    await this.trackRepository.deleteArtistReferences(id);
    await this.favsRepository.deleteArtistFromFavs(id);
    return this.artistRepository.deleteArtist(id);
  }
}
