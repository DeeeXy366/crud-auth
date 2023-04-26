import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { TimestampsType } from '../../shared/types/timestamps.type';

import { CommonBaseEntity } from '../../shared/entities/common-base.entity';
import { UsersEntity } from '../../users/entity/users.entity';

@Entity('Posts')
export class PostsEntity extends CommonBaseEntity {
  @ManyToOne(() => UsersEntity, (user) => user.posts)
  @JoinColumn()
  user: UsersEntity;

  @Column()
  label: string;

  @Column()
  text: string;

  get common(): TimestampsType {
    return {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
