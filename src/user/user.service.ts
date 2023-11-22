import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from 'src/api/dto/signup.dto';
import { User } from 'src/database/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async findUserbyId(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async createUser(signupDto: SignupDto): Promise<User> {
    const user = this.userRepository.create(signupDto);
    return await this.entityManager.save(user);
  }
}
