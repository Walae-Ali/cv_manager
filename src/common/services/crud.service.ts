import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class GenericCrud<T> {
  constructor(protected readonly repository: Repository<T>) {}
  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto as DeepPartial<T>);
    return await this.repository.save(entity);
  }
  /**
   * Récupère toutes les entités avec pagination et filtrage optionnel
   * @param options Options de recherche
   * @param page Numéro de page (commence à 1)
   * @param limit Nombre d'éléments par page
   * @returns Objet contenant les entités et les métadonnées de pagination
   */
  async findAll(options?: FindManyOptions<T>, 
    paginationDto?: PaginationDto): Promise<{ items: T[],page: number, limit: number }> {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 10;
    const [items, total] = await this.repository.findAndCount({
      ...options,
      take: limit,
      skip: (page - 1) * limit,
    });
    
    return {
      items,
      page,
      limit
    };
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
