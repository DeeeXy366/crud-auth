import {Entity, Column, OneToMany} from 'typeorm'
import { CommonBaseEntity } from './common-base.entity'
import { PostsEntity } from './posts.entity'
import {TimestampsType} from "../../shared/types/timestamps.type";

@Entity('PostsUsers')
export class PostsUsersEntity extends CommonBaseEntity {
    @OneToMany(() => PostsEntity, (post) => post.postUser)
    posts: PostsEntity[]

    @Column({ unique: true })
    externalUserId: string

    get common(): TimestampsType {
        return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
