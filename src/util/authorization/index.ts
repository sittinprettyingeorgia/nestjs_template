import Auth from '@interface/auth';
import Base from '@model/base';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService implements Auth {
  constructor() {}

  getAuthUser() {
    return {} as Base;
  }
}
