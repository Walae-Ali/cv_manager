import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  findOne(id: number): Promise<T> {
    return this.repository.findOne({ where: { id } as any });
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
