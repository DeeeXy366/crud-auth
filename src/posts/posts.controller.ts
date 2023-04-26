import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logardian } from 'logardian'

import { UsersEntity } from './entity/users.entity'
import { EventsService } from './events.service'
import { CreateTeamDto } from './interfaces/dtos/create-team.dto'
import { CreateUserDto } from './interfaces/dtos/create-user.dto'
import { GetPositionDto } from './interfaces/dtos/get-position.dto'

@Controller('events')
export class EventsController {
    private readonly _logger = new Logardian()

    constructor(
        private _configService: ConfigService,
        private readonly _eventsService: EventsService,
    ) {}

    @Get('position/:firebaseId')
    async getPosition(
        @Param() { firebaseId }: GetPositionDto,
    ): Promise<number> {
        try {
            return await this._eventsService.getPosition(firebaseId)
        } catch (error) {
            this._logger.debug({
                method: 'getPosition',
                error,
                message: error?.message,
            })
            throw new InternalServerErrorException(error)
        }
    }

    @Post('createUser')
    async createUser(@Body() { firebaseId }: CreateUserDto): Promise<number> {
        try {
            return await this._eventsService.createUser(firebaseId)
        } catch (error) {
            this._logger.debug({
                method: 'createUser',
                error,
                message: error?.message,
            })
            throw new InternalServerErrorException(error)
        }
    }

    @Post('createTeam')
    async createTeam(
        @Body() { firebaseId, score }: CreateTeamDto,
    ): Promise<UsersEntity[] | number> {
        try {
            return await this._eventsService.createTeam(firebaseId, score)
        } catch (error) {
            this._logger.debug({
                method: 'createTeam',
                error,
                message: error?.message,
            })
            throw new InternalServerErrorException(error)
        }
    }
}
