import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/Auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/Auth/guards/admin.guard';

@UseGuards(JwtAuthGuard) // Protect all routes with JWT authentication
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AdminGuard) 
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @UseGuards(AdminGuard)
  @Get()
  findAll(@Body() paginationDto: PaginationDto) {
    return this.userService.findAll({},paginationDto);
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  @UseGuards(AdminGuard) // Restrict this route to admins only
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
