import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { GenericCrud } from '../common/services/crud.service';

@Injectable()
export class UserService extends GenericCrud<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  // Create user
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if the user already exists by email
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return await super.create(createUserDto);

  }

  // Update user
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await super.update(id, updateUserDto);
  
  }
 
}
