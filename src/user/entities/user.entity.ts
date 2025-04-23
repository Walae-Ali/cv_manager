import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ description: 'Unique identifier for the user' }) // Swagger annotation
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Username of the user' }) // Swagger annotation
  @Column()
  username: string;

  @ApiProperty({ description: 'Email address of the user', uniqueItems: true }) // Swagger annotation
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Password of the user (hashed)', writeOnly: true }) // Swagger annotation
  @Column()
  password: string;

  @ApiProperty({ description: 'Role of the user (e.g., admin, user)' }) // Swagger annotation
  @Column()
  role: string;

  @ApiProperty({ description: 'List of CVs associated with the user', type: () => [Cv] }) // Swagger annotation
  @OneToMany(() => Cv, (cv) => cv.user)
  cvs: Cv[];
}
