import { Inject, Injectable } from '@nestjs/common';
import { AlbumRepositoryInterface } from '../../album/interfaces/album.repository.interface';
import { TrackRepositoryInterface } from '../../track/interfaces/track.repository.interface';
import { FavsRepositoryInterface } from '../interfaces/favs.repository.interface';
import { FavsResponseInterface } from '../interfaces/favs.response.interface';
import { ArtistRepositoryInterface } from '../../artist/interfaces/artist.repository.interface';

@Injectable()
export class FavsService {
  constructor(
    @Inject('FavsRepositoryInterface')
    private readonly favsRepository: FavsRepositoryInterface,
    @Inject('ArtistRepositoryInterface')
    private readonly artistRepository: ArtistRepositoryInterface,
    @Inject('AlbumRepositoryInterface')
    private readonly albumRepository: AlbumRepositoryInterface,
    @Inject('TrackRepositoryInterface')
    private readonly trackRepository: TrackRepositoryInterface,
  ) {}

  async getAllFavs() {
    const allFavs: FavsResponseInterface = {
      artists: [],
      albums: [],
      tracks: [],
    };

    const favArtists = await this.favsRepository.getAllFavs();
    for (const artistId of favArtists.artists) {
      const artist = await this.artistRepository.getArtistById(artistId);
      allFavs.artists.push(artist);
    }

    const favAlbums = await this.favsRepository.getAllFavs();
    for (const albumId of favAlbums.albums) {
      const album = await this.albumRepository.getAlbumById(albumId);
      allFavs.albums.push(album);
    }

    const favTracks = await this.favsRepository.getAllFavs();
    for (const trackId of favTracks.tracks) {
      const track = await this.trackRepository.getTrackById(trackId);
      allFavs.tracks.push(track);
    }

    return allFavs;
  }

  async addArtistToFavs(artistId: string): Promise<void> {
    return this.favsRepository.addArtistToFavs(artistId);
  }

  async addAlbumToFavs(albumId: string): Promise<void> {
    return this.favsRepository.addAlbumToFavs(albumId);
  }

  async addTrackToFavs(trackId: string): Promise<void> {
    return this.favsRepository.addTrackToFavs(trackId);
  }

  async deleteArtistFromFavs(artistId: string): Promise<void> {
    return this.favsRepository.deleteArtistFromFavs(artistId);
  }

  async deleteAlbumFromFavs(albumId: string): Promise<void> {
    return this.favsRepository.deleteAlbumFromFavs(albumId);
  }

  async deleteTrackFromFavs(trackId: string): Promise<void> {
    return this.favsRepository.deleteTrackFromFavs(trackId);
  }

  async isArtistFav(artistId: string): Promise<boolean> {
    const favArtists = await this.favsRepository.getAllFavs();
    return favArtists.artists.includes(artistId);
  }

  async isAlbumFav(albumId: string): Promise<boolean> {
    const result = await this.favsRepository.getAllFavs();
    return result.albums.includes(albumId);
  }

  async isTrackFav(trackId: string): Promise<boolean> {
    const result = await this.favsRepository.getAllFavs();
    return result.tracks.includes(trackId);
  }

  async isArtistExist(id: string) {
    const result = await this.artistRepository.getArtistById(id);
    return result !== undefined;
  }

  async isAlbumExist(id: string) {
    const result = await this.albumRepository.getAlbumById(id);
    return result !== undefined;
  }

  async isTrackExist(id: string) {
    const result = await this.trackRepository.getTrackById(id);
    return result !== undefined;
  }
}
