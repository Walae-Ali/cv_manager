import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/crud.service';

@Injectable()
export class UserService extends BaseService<User> {
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

    // Create a new User instance
    const newUser = this.userRepository.create(createUserDto);

    // Save the user to the database
    return await this.userRepository.save(newUser);
  }

  // Update user
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Find the existing user
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Merge the updated data into the existing user
    const updatedUser = this.userRepository.merge(existingUser, updateUserDto);

    // Save the updated user
    return await this.userRepository.save(updatedUser);
  }
 
}
