import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersEntity } from './entity/users.entity'
import { UserController } from './user.controller'

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity])],
    controllers: [UserController],
})
export class UserModule {}
