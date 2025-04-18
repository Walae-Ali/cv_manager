import { Body, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { GenericCrud} from '../common/services/crud.service'
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends GenericCrud<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super(userRepository); // Pass the repository to the generic service
  }

  async register(registerDto: RegisterDto): Promise<User> { 
    const { username, password, email } = registerDto;
  
    // Check if the username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
  
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }
  
    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // Determine the role to assign
    let assignedRole = 'user'; // Default role is 'user'
  
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      role: assignedRole,
    });
   
    return this.userRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; message: string }> {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload); 
    
    return {
      accessToken,
      message: 'Sign-in successful',
    };
  }
}