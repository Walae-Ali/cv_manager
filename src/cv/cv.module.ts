import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { Skill } from '../skill/entities/skill.entity';
import { User } from '../user/entities/user.entity';
import { CvV2Controller } from './cv-v2.controller';
import { ImageStorageModule } from '../common/imageStorage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cv,Skill,User]),
  ImageStorageModule],
  controllers: [CvController,CvV2Controller],
  providers: [CvService],
})
export class CvModule {}
