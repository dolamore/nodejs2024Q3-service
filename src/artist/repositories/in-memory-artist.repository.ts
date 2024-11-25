import { Injectable } from '@nestjs/common';
import { Artist } from '../interfaces/artist.interface';
import { ArtistRepositoryInterface } from '../interfaces/artist.repository.interface';
import { UpdateArtistInfoDto } from '../dto/update-artist-info.dto';

@Injectable()
export class InMemoryArtistRepository implements ArtistRepositoryInterface {
  private artists: Artist[] = [];

  createArtist(artist: Artist): Promise<Artist> {
    this.artists.push(artist);
    return Promise.resolve(artist);
  }

  deleteArtist(id: string): Promise<void> {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index !== -1) {
      this.artists.splice(index, 1);
    }
    return Promise.resolve(undefined);
  }

  getAllArtists(): Promise<Artist[]> {
    const artists = this.artists;
    return Promise.resolve(artists);
  }

  getArtistById(id: string): Promise<Artist | undefined> {
    const artist = this.artists.find((artist) => artist.id === id);
    return Promise.resolve(artist);
  }

  updateArtistInfo(
    id: string,
    updateArtistInfoDto: UpdateArtistInfoDto,
  ): Promise<Artist> {
    const artist = this.artists.find((artist) => artist.id === id);
    if (artist) {
      if (updateArtistInfoDto.name) {
        artist.name = updateArtistInfoDto.name;
      }
      if (updateArtistInfoDto.grammy !== undefined) {
        artist.grammy = updateArtistInfoDto.grammy;
      }
    }
    return Promise.resolve(artist);
  }
}
