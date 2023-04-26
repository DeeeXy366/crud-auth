import { Module } from '@nestjs/common';

import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PostsController],
})
export class PostsModule {}
