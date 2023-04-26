import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException, Logger,
    Param,
    Post,
} from '@nestjs/common'

import { UsersEntity } from './entity/users.entity'
import { CreateTeamDto } from './interfaces/dtos/create-team.dto'
import { CreateUserDto } from './interfaces/dtos/create-user.dto'
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostsEntity} from "./entity/posts.entity";

@Controller('posts')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(PostsEntity)
        private readonly postsRepository: Repository<PostsEntity>,
    ) {}

    @Get('getMyPosts')
    async getMyPosts(): Promise<number> {
        try {
            const posts = await this.postsRepository.find({ user: { id: userId } })

            if (!posts.length) {
                throw new BadRequestException('No posts found')
            }

            return posts
        } catch (error) {
            this.logger.debug({
                method: 'getMyPosts',
                error,
                message: error?.message,
            })
            throw new InternalServerErrorException(error)
        }
    }

    @Get('getPosts')
    async getPosts(): Promise<number> {
        try {
            return 1 //await this.postsService.getPosition()
        } catch (error) {
            this.logger.debug({
                method: 'getPosts',
                error,
                message: error?.message,
            })
            throw new InternalServerErrorException(error)
        }
    }

    @Post('createPost')
    async createPost(@Body() { firebaseId }: CreateUserDto): Promise<number> {
        try {
            return await this.postsService.createUser(firebaseId)
        } catch (error) {
            this.logger.debug({
                method: 'createPost',
                error,
                message: error?.message,
            })
            throw new InternalServerErrorException(error)
        }
    }

    @Post('updatePost')
    async updatePost(
        @Body() { firebaseId, score }: CreateTeamDto,
    ): Promise<UsersEntity[] | number> {
        try {
            return await this.postsService.createTeam(firebaseId, score)
        } catch (error) {
            this.logger.debug({
                method: 'updatePost',
                error,
                message: error?.message,
            })
            throw new InternalServerErrorException(error)
        }
    }

    @Post('deletePost')
    async deletePost(
        @Body() { firebaseId, score }: CreateTeamDto,
    ): Promise<UsersEntity[] | number> {
        try {
            return await this.postsService.createTeam(firebaseId, score)
        } catch (error) {
            this.logger.debug({
                method: 'deletePost',
                error,
                message: error?.message,
            })
            throw new InternalServerErrorException(error)
        }
    }
}
