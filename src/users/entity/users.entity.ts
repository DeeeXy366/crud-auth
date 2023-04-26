import { Entity, Column, OneToMany } from 'typeorm';
import { TimestampsType } from '../../shared/types/timestamps.type';
import { PostsEntity } from '../../posts/entity/posts.entity';
import { CommonBaseEntity } from '../../shared/entities/common-base.entity';

@Entity('Users')
export class UsersEntity extends CommonBaseEntity {
  @OneToMany(() => PostsEntity, (post) => post.user)
  posts: PostsEntity[];

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  get common(): TimestampsType {
    return {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
