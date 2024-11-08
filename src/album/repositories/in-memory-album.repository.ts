import { Injectable } from '@nestjs/common';
import { AlbumRepositoryInterface } from '../interfaces/album.repository.interface';
import { Album } from '../interfaces/album.interface';
import { UpdateAlbumInfoDto } from '../dto/update-album-info.dto';

@Injectable()
export class InMemoryAlbumRepository implements AlbumRepositoryInterface {
  private albums: Album[] = [];

  createAlbum(album: Album): Promise<Album> {
    this.albums.push(album);
    return Promise.resolve(album);
  }

  deleteAlbum(id: string): Promise<void> {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index !== -1) {
      this.albums.splice(index, 1);
    }
    return Promise.resolve(undefined);
  }

  getAlbumById(id: string): Promise<Album | undefined> {
    const album = this.albums.find((album) => album.id === id);
    return Promise.resolve(album);
  }

  getAllAlbums(): Promise<Album[]> {
    const albums = this.albums;
    return Promise.resolve(albums);
  }

  updateAlbumInfo(
    id: string,
    updateAlbumInfoDto: UpdateAlbumInfoDto,
  ): Promise<Album> {
    const album = this.albums.find((album) => album.id === id);
    if (album) {
      if (updateAlbumInfoDto.name) {
        album.name = updateAlbumInfoDto.name;
      }
      if (updateAlbumInfoDto.year !== undefined) {
        album.year = updateAlbumInfoDto.year;
      }
      if (updateAlbumInfoDto.artistId !== undefined) {
        album.artistId = updateAlbumInfoDto.artistId;
      }
    }
    return Promise.resolve(album);
  }

  deleteArtistReferences(id: string): Promise<void> {
    this.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    return Promise.resolve(undefined);
  }
}
