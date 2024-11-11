import { Module } from '@nestjs/common';
import { InMemoryArtistRepository } from '../artist/repositories/in-memory-artist.repository';
import { InMemoryAlbumRepository } from '../album/repositories/in-memory-album.repository';
import { InMemoryTrackRepository } from '../track/repositories/in-memory-track.repository';
import { InMemoryFavsRepository } from '../favs/repositories/in-memory-favs.repository';
import { PrismaUserRepository } from '../user/repositories/prisma-user.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ArtistRepositoryInterface',
      useClass: InMemoryArtistRepository,
    },
    {
      provide: 'AlbumRepositoryInterface',
      useClass: InMemoryAlbumRepository,
    },
    {
      provide: 'TrackRepositoryInterface',
      useClass: InMemoryTrackRepository,
    },
    {
      provide: 'FavsRepositoryInterface',
      useClass: InMemoryFavsRepository,
    },
  ],
  exports: [
    'UserRepositoryInterface',
    'ArtistRepositoryInterface',
    'AlbumRepositoryInterface',
    'TrackRepositoryInterface',
    'FavsRepositoryInterface',
  ],
})
export class RepositoryModule {}
