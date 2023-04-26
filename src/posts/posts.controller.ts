import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';

import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { PostsEntity } from './entity/posts.entity';
import { AuthGuard, ReqUserId } from '../shared/decorators/auth.guard';
import { ReqUserType } from '../shared/types/req-user.type';
import {DeletePostDto, PostsDto, UpdatePostDto} from './interfaces/dtos/posts.dto';
import { UsersService } from '../users/users.service';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
  private readonly postsRepository: Repository<PostsEntity>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly usersService: UsersService,
  ) {
    this.postsRepository = this.entityManager.getRepository(PostsEntity);
  }

  @UseGuards(AuthGuard)
  @Get('getMyPosts')
  async getMyPosts(
    @ReqUserId() { userId }: ReqUserType,
  ): Promise<PostsEntity[]> {
    try {
      const posts = await this.postsRepository.find({ user: { id: userId } });

      if (!posts.length) {
        throw new BadRequestException('No posts found');
      }

      return posts;
    } catch (error) {
      this.logger.debug({
        method: 'getMyPosts',
        error,
        message: error?.message,
      });
      throw new InternalServerErrorException(error);
    }
  }

  @Get('getPosts')
  async getPosts(): Promise<PostsEntity[]> {
    try {
      return await this.postsRepository.find();
    } catch (error) {
      this.logger.debug({
        method: 'getPosts',
        error,
        message: error?.message,
      });
      throw new InternalServerErrorException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('createPost')
  async createPost(
    @ReqUserId() { userId }: ReqUserType,
    @Body() { label, text }: PostsDto,
  ): Promise<boolean> {
    try {
      const user = await this.usersService.getUserById(userId);

      const createdPost = await this.postsRepository.create({
        user,
        label,
        text,
      });
      await this.postsRepository.save(createdPost);

      return true;
    } catch (error) {
      this.logger.debug({
        method: 'createPost',
        error,
        message: error?.message,
      });
      throw new InternalServerErrorException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('updatePost')
  async updatePost(
    @ReqUserId() { userId }: ReqUserType,
    @Body() { label, text, postId }: UpdatePostDto,
  ): Promise<{ id: string; label: string; text: string } & PostsEntity> {
    try {
      await this.postsRepository.findOneOrFail({
        id: postId,
        user: { id: userId },
      });

      return await this.postsRepository.save({
        id: postId,
        label,
        text,
      });
    } catch (error) {
      this.logger.debug({
        method: 'updatePost',
        error,
        message: error?.message,
      });
      throw new InternalServerErrorException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('deletePost')
  async deletePost(
    @ReqUserId() { userId }: ReqUserType,
    @Body() { postId }: DeletePostDto,
  ): Promise<boolean> {
    try {
      await this.postsRepository.softDelete({
        id: postId,
        user: { id: userId },
      });
      return true;
    } catch (error) {
      this.logger.debug({
        method: 'deletePost',
        error,
        message: error?.message,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
