import { Injectable } from '@nestjs/common';
import { Artist } from '../../../prisma/client';
import { ArtistRepositoryInterface } from '../interfaces/artist.repository.interface';
import { UpdateArtistInfoDto } from '../dto/update-artist-info.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaArtistRepository implements ArtistRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createArtist(artist: Artist): Promise<Artist> {
    return this.prisma.artist.create({
      data: artist,
    });
  }

  async deleteArtist(id: string): Promise<void> {
    await this.prisma.artist.delete({
      where: { id },
    });
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async getArtistById(id: string): Promise<Artist | null> {
    return this.prisma.artist.findUnique({
      where: { id },
    });
  }

  async updateArtistInfo(
    id: string,
    updateArtistInfoDto: UpdateArtistInfoDto,
  ): Promise<Artist> {
    return this.prisma.artist.update({
      where: { id },
      data: {
        name: updateArtistInfoDto.name,
        grammy: updateArtistInfoDto.grammy,
      },
    });
  }
}
