import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/crud.service';

@Injectable()
export class SkillService extends BaseService<Skill> {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {
    super(skillRepository);
  }
  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    // Create a new Skill entity using the data provided in CreateSkillDto
    const newSkill = this.skillRepository.create(createSkillDto);

    // Save the entity to the database
    return await this.skillRepository.save(newSkill);
  }

  // Update method
  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    // Find the existing skill entity
    const existingSkill = await this.skillRepository.findOneBy({ id });

    // If no entity is found, throw an error
    if (!existingSkill) {
      throw new Error('Skill not found');
    }

    // Merge the existing entity with the new data from UpdateSkillDto
    const updatedSkill = this.skillRepository.merge(existingSkill, updateSkillDto);

    // Save the updated entity to the database
    return await this.skillRepository.save(updatedSkill);
  }
}
