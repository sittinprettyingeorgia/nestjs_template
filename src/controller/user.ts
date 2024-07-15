import { AuthService } from '@util/authorization';
import { BaseDaoService } from 'src/dao/base';
import BaseController from './base';
import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { User } from '@model/user';

@Crud({
  model: {
    type: User,
  },
})
@Controller('/user')
class UserController extends BaseController {
  constructor(
    public service: BaseDaoService<User>,
    protected readonly auth: AuthService,
  ) {
    super(service, auth);
  }
}

export default UserController;
