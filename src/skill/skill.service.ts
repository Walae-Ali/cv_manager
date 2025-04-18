import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { GenericCrud } from '../common/services/crud.service';

@Injectable()
export class SkillService extends GenericCrud<Skill> {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {
    super(skillRepository);
  }
  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    return super.create(createSkillDto);
  }

  // Update method
  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
   return super.update(id,updateSkillDto);
  }
}
