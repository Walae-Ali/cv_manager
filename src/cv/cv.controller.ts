import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, ParseIntPipe, UploadedFile, BadRequestException } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FilterCvDto } from './dto/filter-cv.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto) {
    return this.cvService.createCv(createCvDto);
  }

  @Get()
  findAllCvs(@Query() filterDto?:FilterCvDto) {
    return this.cvService.findAllCvs(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto) {
    return this.cvService.updateCv(+id, updateCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
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
