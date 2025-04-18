import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { GenericCrud } from '../common/services/crud.service';
import { Skill } from '../skill/entities/skill.entity';
import { User } from '../user/entities/user.entity';
import { FilterCvDto } from './dto/filter-cv.dto';
import { unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class CvService extends GenericCrud<Cv> {
  constructor(
   @InjectRepository(Cv)
   private readonly cvRepo:Repository<Cv>, 
    @InjectRepository(Skill)
   private readonly skillRepository: Repository<Skill>,
  
   @InjectRepository(User)
   private readonly userRepository: Repository<User>,
  ){
    super(cvRepo);
  }
  //this method takes the user id from the dto
  async createCv(createCvDto: CreateCvDto): Promise<Cv> {
    const { skills, userId, ...cvData } = createCvDto;
  
    // 1. Find Skill entities from IDs
    const skillEntities = skills && skills.length? await this.skillRepository.findBy({ id: In(skills) }): [];
  
    // 2. Find the user entity
    const userEntity = userId ? await this.userRepository.findOneBy({ id: userId }) : null;
  
    // 3. Create CV with resolved relations
    const newCv = super.create({
      ...cvData,
      skills: skillEntities,
      user: userEntity,
    });
  
    return  newCv;
  }
  //this method takes the user id from params
  async createCvForUser(createCvDto: CreateCvDto, userId: number): Promise<Cv> {
    const { skills, ...cvData } = createCvDto;
  
    // 1. Vérifie que l'utilisateur existe
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} introuvable`);
    }
  
    // 2. Récupère les entités de compétences si présentes
    const skillEntities = skills?.length
      ? await this.skillRepository.findBy({ id: In(skills) })
      : [];
  
    // 3. Crée et enregistre le CV
    const newCv = this.cvRepo.create({
      ...cvData,
      user,
      skills: skillEntities,
    });
  
    return await this.cvRepo.save(newCv);
  }
  
  

  async updateCv(id: number, updateCvDto: UpdateCvDto): Promise<Cv> {
    const { skills, userId, ...cvData } = updateCvDto;
  
    const existingCv = await this.cvRepo.findOne({
      where: { id },
      relations: ['skills', 'user'],
    });
  
    if (!existingCv) {
      throw new Error('Cv not found');
    }
  
    const skillEntities = skills && skills.length
      ? await this.skillRepository.findBy({ id: In(skills) })
      : existingCv.skills;
  
    const userEntity = userId
      ? await this.userRepository.findOneBy({ id: userId })
      : existingCv.user;
  
    return super.update(id, {
      ...cvData,
      skills: skillEntities,
      user: userEntity,
    });
  }
  

  async findAllCvs(filterDto?: FilterCvDto): Promise<Cv[]> {
    const { critere, age } = filterDto || {};
  
    const query = this.cvRepo.createQueryBuilder('cv')
      .leftJoinAndSelect('cv.user', 'user')
      .leftJoinAndSelect('cv.skills', 'skills');
  
    if (critere) {
      query.andWhere(
        'cv.name LIKE :critere OR cv.firstname LIKE :critere OR cv.job LIKE :critere',
        { critere: `%${critere}%` },
      );
    }
  
    if (age !== undefined) {
      query.andWhere('cv.age = :age', { age });
    }
  
    return await query.getMany();
  }
  
  async findByUser(userId: number): Promise<Cv[]> {
    return this.cvRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'skills'],
    });
  }

  async uploadCvImage(cvId: number, filename: string): Promise<Cv> {
    const cv = await this.cvRepo.findOneBy({ id: cvId });
    if (!cv) {
      throw new NotFoundException(`CV avec ID ${cvId} introuvable`);
    }


    // Mettre à jour le chemin de l'image
    cv.image = `public/uploads/${filename}`;
    return this.cvRepo.save(cv);
  }
  async getImage(imagePath: string): Promise<any> {
    const fullPath = join(process.cwd(), 'public', imagePath);
    return { path: fullPath };
  }

 
}
