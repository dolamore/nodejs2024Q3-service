import { Album } from './album.interface';
import { UpdateAlbumInfoDto } from '../dto/update-album-info.dto';

export interface AlbumRepositoryInterface {
  getAllAlbums(): Promise<Album[]>;

  getAlbumById(id: string): Promise<Album | undefined>;

  createAlbum(album: Album): Promise<Album>;

  updateAlbumInfo(
    id: string,
    updateAlbumInfoDto: UpdateAlbumInfoDto,
  ): Promise<Album>;

  deleteAlbum(id: string): Promise<void>;

  deleteArtistReferences(id: string): Promise<void>;
}
