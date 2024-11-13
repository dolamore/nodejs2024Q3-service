import { Injectable } from '@nestjs/common';
import { FavsRepositoryInterface } from '../interfaces/favs.repository.interface';
import { Favorites } from '../../../prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaFavsRepository implements FavsRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateFavorite(): Promise<{
    id: string;
    artists: string[];
    albums: string[];
    tracks: string[];
  }> {
    let favorite = await this.prisma.favorites.findFirst();
    if (!favorite) {
      favorite = await this.prisma.favorites.create({
        data: { artists: [], albums: [], tracks: [] },
      });
    }
    return favorite;
  }

  async addArtistToFavs(artistId: string): Promise<void> {
    const favorite = await this.getOrCreateFavorite();
    if (!favorite.artists.includes(artistId)) {
      await this.prisma.favorites.update({
        where: { id: favorite.id },
        data: { artists: { push: artistId } },
      });
    }
  }

  async addAlbumToFavs(albumId: string): Promise<void> {
    const favorite = await this.getOrCreateFavorite();
    if (!favorite.albums.includes(albumId)) {
      await this.prisma.favorites.update({
        where: { id: favorite.id },
        data: { albums: { push: albumId } },
      });
    }
  }

  async addTrackToFavs(trackId: string): Promise<void> {
    const favorite = await this.getOrCreateFavorite();
    if (!favorite.tracks.includes(trackId)) {
      await this.prisma.favorites.update({
        where: { id: favorite.id },
        data: { tracks: { push: trackId } },
      });
    }
  }

  async deleteArtistFromFavs(artistId: string): Promise<void> {
    const favorite = await this.getOrCreateFavorite();
    await this.prisma.favorites.update({
      where: { id: favorite.id },
      data: { artists: favorite.artists.filter((id) => id !== artistId) },
    });
  }

  async deleteAlbumFromFavs(albumId: string): Promise<void> {
    const favorite = await this.getOrCreateFavorite();
    await this.prisma.favorites.update({
      where: { id: favorite.id },
      data: { albums: favorite.albums.filter((id) => id !== albumId) },
    });
  }

  async deleteTrackFromFavs(trackId: string): Promise<void> {
    const favorite = await this.getOrCreateFavorite();
    await this.prisma.favorites.update({
      where: { id: favorite.id },
      data: { tracks: favorite.tracks.filter((id) => id !== trackId) },
    });
  }

  async getAllFavs(): Promise<Favorites> {
    const favorite = await this.getOrCreateFavorite();
    return {
      id: favorite.id,
      artists: favorite.artists,
      albums: favorite.albums,
      tracks: favorite.tracks,
    };
  }
}
