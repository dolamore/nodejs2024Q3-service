import { Injectable } from '@nestjs/common';
import { AlbumRepositoryInterface } from '../interfaces/album.repository.interface';
import { Album } from '../../../prisma/client';
import { UpdateAlbumInfoDto } from '../dto/update-album-info.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaAlbumRepository implements AlbumRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createAlbum(album: Album): Promise<Album> {
    return this.prisma.album.create({
      data: album,
    });
  }

  async deleteAlbum(id: string): Promise<void> {
    await this.prisma.album.delete({
      where: { id },
    });
  }

  async getAlbumById(id: string): Promise<Album | null> {
    return this.prisma.album.findUnique({
      where: { id },
    });
  }

  async getAllAlbums(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async updateAlbumInfo(
    id: string,
    updateAlbumInfoDto: UpdateAlbumInfoDto,
  ): Promise<Album> {
    return this.prisma.album.update({
      where: { id },
      data: {
        name: updateAlbumInfoDto.name,
        year: updateAlbumInfoDto.year,
        artistId: updateAlbumInfoDto.artistId,
      },
    });
  }

  async deleteArtistReferences(id: string): Promise<void> {
    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });
  }
}
