import IBase, { Access, AccessLevel } from '@interface/base';
import { BaseEntity } from 'typeorm';

class Base extends BaseEntity implements IBase {
  access: Access;
  accessLevel: AccessLevel;
  id: string;
  isArchived: boolean;
  updatedBy: number;
  updatedOn: number;
  createdBy: number;
  createdOn: number;

  constructor(access: Access, accessLevel: AccessLevel) {
    super();
    this.id = crypto.randomUUID();
    this.access = access;
    this.accessLevel = accessLevel;
    this.isArchived = false;
    this.updatedBy = Date.now();
    this.updatedOn = Date.now();
    this.createdBy = Date.now();
    this.createdOn = Date.now();
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      access: this.access,
      accessLevel: this.accessLevel,
      isArchived: this.isArchived,
      updatedOn: this.updatedOn,
      updatedBy: this.updatedBy,
      createdOn: this.createdOn,
      createdBy: this.createdBy,
    });
  }

  private throwErr(requestor: IBase) {
    throw new Error(`Access Denied.\n\n.
      requested: ${this.toString()}\n\n
      requestor: ${requestor.toString()}
      `);
  }

  private isAccessibleBy(requestor: IBase): void {
    const accessLevels = ['public', 'private', 'secret', 'critical'];

    const baseIndex = accessLevels.indexOf(this.accessLevel);
    const requestorIndex = accessLevels.indexOf(requestor.accessLevel);

    if (requestorIndex < baseIndex) {
      this.throwErr(requestor);
    }
  }

  willAllowAccessTo(requestor: IBase): { data: Base } | void {
    this.isAccessibleBy(requestor);

    this.removeSensitiveProperties(requestor, this);
    return { data: { ...this } };
  }

  private removeSensitiveProperties(requestor: IBase, dirtyObj: IBase): void {
    for (const [key, property] of Object.entries(dirtyObj)) {
      if (property instanceof Base) {
        try {
          property.willAllowAccessTo(requestor);
        } catch (e) {
          console.log('no errors');
          dirtyObj[key] = null;
        }
      }
    }
  }
}

export default Base;
