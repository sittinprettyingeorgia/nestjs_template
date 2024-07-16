import Base from '@model/base';
import {
  CrudController,
  Override,
  type CrudRequest,
  GetManyDefaultResponse,
  type CreateManyDto,
} from '@nestjsx/crud';
import { AuthService } from '@util/authorization';
import { BaseDaoService } from 'src/dao/base';

class BaseController extends Base implements CrudController<Base> {
  constructor(
    public service: BaseDaoService<Base>,
    protected readonly auth: AuthService,
  ) {
    // default access and accessLevel
    super('read', 'private');
  }

  private get base(): CrudController<Base> {
    return this;
  }

  private ensureDefined<T>(method: T | undefined): T {
    if (!method) {
      throw new Error('Method not defined');
    }

    return method;
  }

  @Override()
  getMany(req: CrudRequest): Promise<GetManyDefaultResponse<Base> | Base[]> {
    const user: Base = this.auth.getAuthUser();
    this.willAllowAccessTo(user, 'read');
    const method = this.ensureDefined(this.base.getManyBase);
    return method(req);
  }

  @Override()
  getOne(req: CrudRequest): Promise<Base> {
    const user: Base = this.auth.getAuthUser();
    this.willAllowAccessTo(user, 'read');
    const method = this.ensureDefined(this.base.getOneBase);
    return method(req);
  }

  @Override()
  createOne(req: CrudRequest, dto: Base): Promise<Base> {
    const user: Base = this.auth.getAuthUser();
    dto.willAllowAccessTo(user, 'create');
    const method = this.ensureDefined(this.base.createOneBase);
    return method(req, dto);
  }

  @Override()
  createMany(req: CrudRequest, dto: CreateManyDto<Base>): Promise<Base[]> {
    const user: Base = this.auth.getAuthUser();
    dto.bulk[0].willAllowAccessTo(user, 'create');
    const method = this.ensureDefined(this.base.createManyBase);
    return method(req, dto);
  }

  @Override()
  updateOne(req: CrudRequest, dto: Base): Promise<Base> {
    const user: Base = this.auth.getAuthUser();
    dto.willAllowAccessTo(user, 'update');
    const method = this.ensureDefined(this.base.updateOneBase);
    return method(req, dto);
  }

  @Override()
  replaceOne(req: CrudRequest, dto: Base): Promise<Base> {
    const user: Base = this.auth.getAuthUser();
    dto.willAllowAccessTo(user, 'write');
    const method = this.ensureDefined(this.base.replaceOneBase);
    return method(req, dto);
  }

  @Override()
  deleteOne(req: CrudRequest): Promise<void | Base> {
    const user: Base = this.auth.getAuthUser();
    this.willAllowAccessTo(user, 'write');
    const method = this.ensureDefined(this.base.deleteOneBase);
    return method(req);
  }

  @Override()
  recoverOne(req: CrudRequest): Promise<void | Base> {
    const user: Base = this.auth.getAuthUser();
    this.willAllowAccessTo(user, 'write');
    const method = this.ensureDefined(this.base.recoverOneBase);
    return method(req);
  }
}

export default BaseController;
