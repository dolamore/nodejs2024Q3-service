import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { RepositoryModule } from '../repositories/repository.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [RepositoryModule, LoggingModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
