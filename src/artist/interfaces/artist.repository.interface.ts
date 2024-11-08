import { Artist } from './artist.interface';
import { UpdateArtistInfoDto } from '../dto/update-artist-info.dto';

export interface ArtistRepositoryInterface {
  getAllArtists(): Promise<Artist[]>;

  getArtistById(id: string): Promise<Artist | undefined>;

  createArtist(artist: Artist): Promise<Artist>;

  updateArtistInfo(
    id: string,
    updateArtistInfoDto: UpdateArtistInfoDto,
  ): Promise<Artist>;

  deleteArtist(id: string): Promise<void>;
}
