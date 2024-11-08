import { Injectable } from '@nestjs/common';
import { FavsRepositoryInterface } from '../interfaces/favs.repository.interface';
import { Favorites } from '../interfaces/favs.interface';

@Injectable()
export class InMemoryFavsRepository implements FavsRepositoryInterface {
  private artistIds: string[] = [];
  private albumIds: string[] = [];
  private trackIds: string[] = [];

  async addArtistToFavs(artistId: string): Promise<void> {
    this.artistIds.push(artistId);
  }

  async addAlbumToFavs(albumId: string): Promise<void> {
    this.albumIds.push(albumId);
  }

  async addTrackToFavs(trackId: string): Promise<void> {
    this.trackIds.push(trackId);
  }

  async deleteArtistFromFavs(artistId: string): Promise<void> {
    this.artistIds = this.artistIds.filter((id) => id !== artistId);
  }

  async deleteAlbumFromFavs(albumId: string): Promise<void> {
    this.albumIds = this.albumIds.filter((id) => id !== albumId);
  }

  async deleteTrackFromFavs(trackId: string): Promise<void> {
    this.trackIds = this.trackIds.filter((id) => id !== trackId);
  }

  async getAllFavs(): Promise<Favorites> {
    return {
      artists: this.artistIds,
      albums: this.albumIds,
      tracks: this.trackIds,
    };
  }
}
