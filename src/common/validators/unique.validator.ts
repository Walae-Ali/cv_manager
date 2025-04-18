import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  import { Injectable } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from '../../user/entities/user.entity';
  
  @ValidatorConstraint({ async: true })
  @Injectable()
  export class UniqueValidator implements ValidatorConstraintInterface {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}
  
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
      const [property] = args.constraints;
      const user = await this.userRepository.findOne({ where: { [property]: value } });
      return !user; // Return true if no user is found (value is unique)
    }
  
    defaultMessage(args: ValidationArguments): string {
      const [property] = args.constraints;
      return `${property} must be unique`;
    }
  }
  
  export function Unique(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: UniqueValidator,
      });
    };
  }