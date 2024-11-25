import { Artist } from '../../artist/interfaces/artist.interface';
import { Album } from '../../album/interfaces/album.interface';
import { Track } from '../../track/interfaces/track.interface';

export interface FavsResponseInterface {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
