import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as md5 from 'md5';

import { UsersEntity } from './entity/users.entity';
import { RegistrationDto } from './interfaces/dtos/registration.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  private readonly usersRepository: Repository<UsersEntity>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) {
    this.usersRepository = this.entityManager.getRepository(UsersEntity);
  }

  @Post('signIn')
  async signIn(
    @Body() { username, password }: RegistrationDto,
  ): Promise<string> {
    try {
      const user = await this.usersRepository.findOne({
        username,
        password: md5(password),
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      return await this.jwtService.signAsync({
        username: user.username,
        sub: user.id,
      });
    } catch (error) {
      this.logger.debug({
        method: 'signIn',
        error,
        message: error?.message,
      });
      throw new InternalServerErrorException(error);
    }
  }

  @Post('signUp')
  async signUp(
    @Body() { username, password }: RegistrationDto,
  ): Promise<boolean> {
    try {
      const createdUser = await this.usersRepository.create({
        username,
        password: md5(password),
      });
      await this.usersRepository.save(createdUser);

      return true;
    } catch (error) {
      this.logger.debug({
        method: 'signUp',
        error,
        message: error?.message,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
