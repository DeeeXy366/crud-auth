import {BadRequestException, Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

import {TeamsEntity} from './entity/teams.entity'
import {UsersEntity} from './entity/users.entity'

@Injectable()
export class EventsService {
    private readonly _maxTeamSpace: number

    constructor(
        private _configService: ConfigService,
        @InjectRepository(UsersEntity)
        private readonly _usersRepository: Repository<UsersEntity>,
        @InjectRepository(TeamsEntity)
        private readonly _teamsRepository: Repository<TeamsEntity>,
    ) {
        const defaultMaxTeamSpace = 10

        this._maxTeamSpace = this._configService.get<number>(
            'MAX_TEAM_SPACE',
            defaultMaxTeamSpace,
        )
    }

    async getPosition(firebaseId: string): Promise<number> {
        const user = await this._usersRepository.findOne({firebaseId})
        const result = user?.position

        if (!user) {
            throw new BadRequestException(
                `User with firebaseId: ${firebaseId}, don't exist`,
            )
        }

        await this._usersRepository.save({
            id: user.id,
            position: 0,
        })

        return result
    }

    async createUser(firebaseId: string): Promise<number> {
        const user = await this._usersRepository.findOne({firebaseId})

        if (!user) {
            const newUser = await this._usersRepository.create({
                firebaseId,
            })
            const createdUser = await this._usersRepository.save(newUser)

            return createdUser.createdAt.getTime()
        }

        const updatedUser = await this._usersRepository.save({
            id: user.id,
            updatedAt: new Date(),
        })

        return updatedUser.updatedAt.getTime()
    }

    async createTeam(
        firebaseId: string,
        score: number,
    ): Promise<UsersEntity[] | number> {
        const user = await this._usersRepository.findOne(
            {firebaseId},
            {relations: ['team']},
        )
        let team = user?.team

        if (!user) {
            throw new BadRequestException(
                `User with firebaseId: ${firebaseId}, don't exist`,
            )
        }

        if (!team) {
            const teamsCount = await this._teamsRepository.findAndCount({
                relations: ['users'],
            })

            const newTeam = await this._teamsRepository.create({
                teamNumber: teamsCount[1] + 1,
            })

            team = !teamsCount[1]
                ? await this._teamsRepository.save(newTeam)
                : teamsCount[0].reduce((a, b) =>
                    a.users.length < b.users.length ? a : b,
                )

            if (team?.users && team.users.length >= this._maxTeamSpace) {
                team = await this._teamsRepository.save(newTeam)
            }

            await this._usersRepository.save({
                id: user.id,
                team,
            })
        }

        if (score) {
            const updatedUser = await this._usersRepository.save({
                id: user.id,
                score: score + user.score,
            })

            return updatedUser.score
        }

        const userTeam = await this._teamsRepository.findOne(team.id, {
            relations: ['users'],
        })

        return userTeam.users.sort(
            (a, b) => b.score - a.score,
        )
    }
}
