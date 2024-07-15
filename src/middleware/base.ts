import { Injectable } from '@nestjs/common';
import { AuthService } from '@util/authorization';

@Injectable()
export class AuthMiddleware {
  constructor(private readonly auth: AuthService) {}
}
