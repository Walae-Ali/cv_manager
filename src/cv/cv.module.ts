import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';
import { CvV2Controller } from './cv-v2.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cv,Skill,User])],
  controllers: [CvController,CvV2Controller],
  providers: [CvService],
})
export class CvModule {}
