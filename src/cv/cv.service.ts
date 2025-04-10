import { Injectable } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { BaseService } from 'src/common/services/crud.service';
import { Skill } from 'src/skill/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CvService extends BaseService<Cv> {
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
  async create(createCvDto: CreateCvDto): Promise<Cv> {
    const { skills, userId, ...cvData } = createCvDto;
  
    // 1. Find Skill entities from IDs
    const skillEntities = skills && skills.length? await this.skillRepository.findBy({ id: In(skills) }): [];
  
    // 2. Find the user entity
    const userEntity = userId ? await this.userRepository.findOneBy({ id: userId }) : null;
  
    // 3. Create CV with resolved relations
    const newCv = this.cvRepo.create({
      ...cvData,
      skills: skillEntities,
      user: userEntity,
    });
  
    return this.cvRepo.save(newCv);
  }
  

  async update(id: number, updateCvDto: UpdateCvDto): Promise<Cv> {
    const { skills, userId, ...cvData } = updateCvDto;
  
    // 1. Find the existing Cv entity by ID
    const existingCv = await this.cvRepo.findOne({ where: { id }, relations: ['skills', 'user'] });
  
    if (!existingCv) {
      throw new Error('Cv not found');
    }
  
    // 2. Resolve Skill entities from IDs if provided
    const skillEntities = skills && skills.length? await this.skillRepository.findBy({ id: In(skills) }): existingCv.skills;  // Use the existing skills if no new ones are provided
  
    // 3. Find the User entity if a userId is provided
    const userEntity = userId ? await this.userRepository.findOneBy({ id: userId }) : existingCv.user;  // Use the existing user if no new one is provided
  
    // 4. Update the existing Cv with the new data
    const updatedCv = this.cvRepo.merge(existingCv, cvData, {
      skills: skillEntities,
      user: userEntity,
    });
  
    // 5. Save and return the updated Cv entity
    return this.cvRepo.save(updatedCv);
  }
  

 
}
