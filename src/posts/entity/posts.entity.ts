import { Entity, Column, OneToMany } from 'typeorm'

import { TimestampsType } from '../../shared/types/timestamps.type'

import { CommonBaseEntity } from './common-base.entity'
import { UsersEntity } from './users.entity'

@Entity('teams')
export class TeamsEntity extends CommonBaseEntity {
    @OneToMany(() => UsersEntity, (user) => user.team)
    users: UsersEntity[]

    @Column({ unique: true })
    teamNumber: number

    get common(): TimestampsType {
        return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
