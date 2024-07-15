import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BaseEntity, Repository } from 'typeorm';

@Injectable()
export class BaseDaoService<
  T extends BaseEntity,
> extends TypeOrmCrudService<T> {
  constructor(@InjectRepository(BaseEntity) repo: Repository<T>) {
    super(repo);
  }
}
