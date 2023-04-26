import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CronService } from './cron.service'
import { PostsEntity } from './entity/posts.entity'
import { UsersEntity } from './entity/users.entity'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, PostsEntity])],
    controllers: [EventsController],
    providers: [EventsService, CronService],
})
export class EventsModule {}
