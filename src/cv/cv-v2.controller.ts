import { Controller, Get, Post, Body, Req, UseGuards, Put, Param, NotFoundException, ForbiddenException, Delete } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { Request } from 'express';
import { UpdateCvDto } from './dto/update-cv.dto';

@Controller({ path: 'cv', version: '2' }) // 👈 version 2
export class CvV2Controller {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    // Le userId a été injecté dans req par le middleware
    const userId = req['user']?.id;
    return this.cvService.createCvForUser(createCvDto, userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = req['user']?.id;
    return this.cvService.findByUser(userId);
  }

 //update
 @Put(':id')
async update(@Param('id') id: number, @Body() updateCvDto: UpdateCvDto, @Req() req: Request) {
  const userId = req['user']?.id;

  const cv = await this.cvService.findOne(id);
  if (!cv) {
    throw new NotFoundException('CV not found');
  }

  if (cv.user?.id !== userId) {
    console.log(cv.user.id," ",userId);
    throw new ForbiddenException('Vous ne pouvez pas modifier ce CV');
  }

  return this.cvService.updateCv(id, updateCvDto);
}
@Delete(':id')
async remove(@Param('id') id: number, @Req() req: Request) {
  const userId = req['user']?.id;

  const cv = await this.cvService.findOne(id);
  if (!cv) {
    throw new NotFoundException('CV not found');
  }

  if (cv.user?.id !== userId) {
    throw new ForbiddenException('Vous ne pouvez pas supprimer ce CV');
  }

  return this.cvService.remove(id);
}

}
