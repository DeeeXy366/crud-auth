import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UsersEntity } from './entity/users.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly usersRepository: Repository<UsersEntity>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.usersRepository = this.entityManager.getRepository(UsersEntity);
  }

  async getUserById(id: string): Promise<UsersEntity> {
    try {
      return await this.usersRepository.findOneOrFail(id);
    } catch (error) {
      this.logger.debug({
        method: 'getUserById',
        error,
        message: error?.message,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
