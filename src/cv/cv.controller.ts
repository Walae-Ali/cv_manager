import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, ParseIntPipe, UploadedFile, BadRequestException, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FilterCvDto } from './dto/filter-cv.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/Auth/guards/jwt-auth.guard';
import { GetUser } from 'src/Auth/decorators/get-user.decorator';
import { AdminGuard } from 'src/Auth/guards/admin.guard';

@Controller('cv')
@UseGuards(JwtAuthGuard)
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto) {
    return this.cvService.createCv(createCvDto);
  }
 @UseGuards(AdminGuard)
  @Get()
  findAllCvs( @GetUser('userId') userId: number,@Query() filterDto?:FilterCvDto) {

    return this.cvService.findAllCvs(filterDto);
  }

  @Get(':id')
 async findOne(@Param('id') id: string,     @GetUser('userId') userId: number
) {
  const cv = await this.cvService.findOne(+id);

  if (!cv || cv.user.id !== userId) {
    throw new ForbiddenException('You are not allowed to update this CV');
  }
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @GetUser('userId') userId: number
  ) {
    const cv = await this.cvService.findOne(+id);
  
    if (!cv || cv.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to update this CV');
    }
  
    return this.cvService.updateCv(+id, updateCvDto);
  }

  @Delete(':id')
 async remove(@Param('id') id: string  ,  @GetUser('userId') userId: number
) {
  const cv = await this.cvService.findOne(+id);

  if (!cv || cv.user.id !== userId) {
    throw new ForbiddenException('You are not allowed to update this CV');
  }
    return this.cvService.remove(+id);
  }


  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier téléchargé');
    }
    return this.cvService.uploadCvImage(id, file.filename);
  }
  @Get(':id/image')
  async getImage(@Param('id', ParseIntPipe) id: number) {
    const cv = await this.cvService.findOne(id);
    if (!cv) {
      throw new BadRequestException('CV non trouvé');
    }
    return this.cvService.getImage(cv.image);
  }
}
