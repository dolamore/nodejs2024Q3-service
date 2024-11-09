import { Favorites } from './favs.interface';

export interface FavsRepositoryInterface {
  getAllFavs(): Promise<Favorites>;

  addTrackToFavs(trackId: string): Promise<void>;

  deleteTrackFromFavs(trackId: string): Promise<void>;

  addAlbumToFavs(albumId: string): Promise<void>;

  deleteAlbumFromFavs(albumId: string): Promise<void>;

  addArtistToFavs(artistId: string): Promise<void>;

  deleteArtistFromFavs(artistId: string): Promise<void>;
}
