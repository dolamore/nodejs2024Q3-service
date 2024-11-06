import { Module } from '@nestjs/common';
import { InMemoryUserRepository } from '../user/repositories/in-memory-user.repository';

@Module({
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: InMemoryUserRepository,
    },
  ],
  exports: ['UserRepositoryInterface'],
})
export class RepositoryModule {}
