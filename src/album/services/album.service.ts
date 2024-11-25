import { Inject, Injectable } from '@nestjs/common';
import { AlbumRepositoryInterface } from '../interfaces/album.repository.interface';
import { Album } from '../interfaces/album.interface';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateAlbumInfoDto } from '../dto/update-album-info.dto';
import { TrackRepositoryInterface } from '../../track/interfaces/track.repository.interface';
import { FavsRepositoryInterface } from '../../favs/interfaces/favs.repository.interface';

@Injectable()
export class AlbumService {
  constructor(
    @Inject('AlbumRepositoryInterface')
    private readonly albumRepository: AlbumRepositoryInterface,
    @Inject('TrackRepositoryInterface')
    private readonly trackRepository: TrackRepositoryInterface,
    @Inject('FavsRepositoryInterface')
    private readonly favsRepository: FavsRepositoryInterface,
  ) {}

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    return this.albumRepository.createAlbum(album);
  }

  async getAllAlbums(): Promise<Album[]> {
    return this.albumRepository.getAllAlbums();
  }

  async getAlbumById(id: string) {
    return this.albumRepository.getAlbumById(id);
  }

  async updateAlbumInfo(id: string, updateAlbumInfoDto: UpdateAlbumInfoDto) {
    return this.albumRepository.updateAlbumInfo(id, updateAlbumInfoDto);
  }

  async deleteAlbum(id: string) {
    await this.trackRepository.deleteAlbumReferences(id);
    await this.favsRepository.deleteAlbumFromFavs(id);
    return this.albumRepository.deleteAlbum(id);
  }
}
