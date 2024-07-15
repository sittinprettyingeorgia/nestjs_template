import Base from '@model/base';
import { Profile } from '@model/customer-profile';

export class User extends Base {
  email?: string;
  phone?: string;
  profile?: Profile;

  constructor() {
    super('read', 'public');
  }
}
