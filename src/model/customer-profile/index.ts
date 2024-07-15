import Base from '@model/base';

/*
This should be a business profile.
This should include things like:
amount spent, regular purchases, marketing, etc.
 */
interface ProfileType extends Base {
  getTotalPayments: string;
  getTotalPurchases: number;
  getTargetProducts: string[];
}

export type Profile = Partial<ProfileType>;
