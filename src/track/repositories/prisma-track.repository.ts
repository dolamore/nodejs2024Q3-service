import { Injectable } from '@nestjs/common';
import { TrackRepositoryInterface } from '../interfaces/track.repository.interface';
import { Track } from '../../../prisma/client';
import { UpdateTrackInfoDto } from '../dto/update-track-info.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaTrackRepository implements TrackRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async createTrack(track: Track): Promise<Track> {
    return this.prisma.track.create({
      data: track,
    });
  }

  async deleteTrack(id: string): Promise<void> {
    await this.prisma.track.delete({
      where: { id },
    });
  }

  async getTrackById(id: string): Promise<Track | null> {
    return this.prisma.track.findUnique({
      where: { id },
    });
  }

  async getAllTracks(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async updateTrackInfo(
    id: string,
    updateTrackInfoDto: UpdateTrackInfoDto,
  ): Promise<Track> {
    return this.prisma.track.update({
      where: { id },
      data: {
        ...updateTrackInfoDto,
      },
    });
  }

  async deleteAlbumReferences(albumId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }

  async deleteArtistReferences(artistId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
