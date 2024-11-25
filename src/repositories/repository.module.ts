import { Module } from '@nestjs/common';
import { PrismaUserRepository } from '../user/repositories/prisma-user.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaTrackRepository } from '../track/repositories/prisma-track.repository';
import { PrismaArtistRepository } from '../artist/repositories/prisma-artist.repository';
import { PrismaAlbumRepository } from '../album/repositories/prisma-album.repository';
import { PrismaFavsRepository } from '../favs/repositories/prisma-fav.repository';
import { PrismaRefreshTokenRepository } from '../user/repositories/prisma-token.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ArtistRepositoryInterface',
      useClass: PrismaArtistRepository,
    },
    {
      provide: 'AlbumRepositoryInterface',
      useClass: PrismaAlbumRepository,
    },
    {
      provide: 'TrackRepositoryInterface',
      useClass: PrismaTrackRepository,
    },
    {
      provide: 'FavsRepositoryInterface',
      useClass: PrismaFavsRepository,
    },
    {
      provide: 'PrismaRefreshTokenRepository',
      useClass: PrismaRefreshTokenRepository,
    },
  ],
  exports: [
    'UserRepositoryInterface',
    'ArtistRepositoryInterface',
    'AlbumRepositoryInterface',
    'TrackRepositoryInterface',
    'FavsRepositoryInterface',
    'PrismaRefreshTokenRepository',
  ],
})
export class RepositoryModule {}
