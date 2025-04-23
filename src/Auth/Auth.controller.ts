import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './Auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
//import { GetUser } from './decorators/get-user.decorator'; 

@ApiTags('Auth') // Group routes under the "Auth" tag in Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Describe the purpose of the route
  @ApiResponse({ status: 201, description: 'User registered successfully.' }) // Document the response
  @ApiResponse({ status: 400, description: 'Invalid input.' }) // Document possible errors
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' }) // Describe the purpose of the route
  @ApiResponse({ status: 200, description: 'User logged in successfully and access token returned.' }) // Document the response
  @ApiResponse({ status: 401, description: 'Invalid credentials.' }) // Document possible errors
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

/*
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com",
  "role": "user"
}

"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5fZG9lIiwic3ViIjo2LCJyb2xlIjoidXNlciIsImlhdCI6MTc0NDE1NTU3OSwiZXhwIjoxNzQ0MTU5MTc5fQ.pfUlrtsj7bQP2Pc_W29ru3CXGOK2sE4rtoCO85DjgNU"
*/