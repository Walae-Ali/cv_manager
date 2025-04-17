import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GenericCrud<T> {
  constructor(protected readonly repository: Repository<T>) {}
  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto as DeepPartial<T>);
    return await this.repository.save(entity);
  }
  /**
   * Récupère toutes les entités avec filtrage optionnel
   * @param options Options de recherche
   * @returns Liste des entités
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }
 

  async findOne(id: number | string, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne({ 
      where: { id } as any, 
      ...options 
    });
    
    if (!entity) {
      throw new NotFoundException(`Entité avec l'ID ${id} non trouvée`);
    }
    
    return entity;
  }
  async update(id: number | string, updateDto: DeepPartial<T>): Promise<T> {
    const entity = await this.findOne(id);
    
    Object.assign(entity, updateDto);
    return await this.repository.save(entity);
  }

  /**
   * Supprime une entité par son ID
   * @param id ID de l'entité à supprimer
   * @returns Résultat de l'opération
   */
  async remove(id: number | string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}
