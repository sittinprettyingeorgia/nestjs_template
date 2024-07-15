import IBase, { Access, AccessLevel } from '@interface/base';
import { BaseEntity } from 'typeorm';

const LEVEL1 = 'private';
const LEVEL2 = 'secret';
const LEVEL3 = 'critical';

const READ = 'read';
const WRITE = 'write';
const UPDATE = 'update';
const CREATE = 'create';

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

  private throwErr() {
    throw new Error(`Access Denied.\n\n.${this.toString()}`);
  }

  private isAccessibleBy(requestor: IBase) {
    if (!requestor?.accessLevel && this.accessLevel) {
      this.throwErr();
    }

    const hasLevel3AccessLevel: boolean = requestor.accessLevel === LEVEL3;
    const hasLevel2AccessLevel: boolean = requestor.accessLevel === LEVEL2;
    const hasLevel1AccessLevel: boolean = requestor.accessLevel === LEVEL1;
    let hasAccessLevel: boolean =
      this.accessLevel === 'public' || !this.accessLevel;

    if (hasAccessLevel) {
      return;
    }

    switch (this.accessLevel) {
      case LEVEL3:
        hasAccessLevel = hasLevel3AccessLevel;
        break;
      case LEVEL2:
        hasAccessLevel = hasLevel3AccessLevel || hasLevel2AccessLevel;
        break;
      case LEVEL1:
        hasAccessLevel =
          hasLevel3AccessLevel || hasLevel2AccessLevel || hasLevel1AccessLevel;
        break;
    }

    if (!hasAccessLevel) {
      this.throwErr();
    }
  }

  willAllowAccessTo(
    requestor: IBase,
    accessType: Access,
  ): { data: Base } | void {
    this.isAccessibleBy(requestor);

    const hasCompleteCRUDAccess: boolean = requestor.access === WRITE;
    const hasReadAccess: boolean = requestor.access === READ;
    const hasUpdateAccess: boolean = requestor.access === UPDATE;
    const hasCreateAccess: boolean = requestor.access === CREATE;
    const hasAccess: boolean = !this.access || this.access === requestor.access;
    if (!hasAccess) {
      this.throwErr();
    }

    let result = { data: this };

    switch (accessType) {
      case WRITE:
        if (hasCompleteCRUDAccess) {
          this.removeSensitiveProperties(requestor, this);
          result.data = this;
        }
      case UPDATE:
        if (hasUpdateAccess || hasCompleteCRUDAccess) {
          this.removeSensitiveProperties(requestor, this);
          result = Object.seal({ data: this });
        }
      case CREATE:
        if (!(hasUpdateAccess || hasCompleteCRUDAccess || hasCreateAccess)) {
          this.throwErr();
        }
      case READ:
        if (
          !(
            hasUpdateAccess ||
            hasCompleteCRUDAccess ||
            hasCreateAccess ||
            hasReadAccess
          )
        ) {
          this.removeSensitiveProperties(requestor, this);
          return Object.freeze({ data: this });
        }
      default:
        this.throwErr();
    }
  }

  /**
  TODO: we need to verify this ai generated code works. 
  */
  private removeSensitiveProperties(requestor: IBase, dirtyObj: IBase): void {
    for (const [key, property] of Object.entries(dirtyObj)) {
      try {
        // Check access for the property
        this.willAllowAccessTo(requestor, dirtyObj.access);
      } catch (error) {
        // If access is denied, delete the property
        dirtyObj = { ...dirtyObj, [key]: null };
        continue;
      }

      // If the property is an object, recursively check its properties
      if (typeof property === 'object' && property !== null) {
        this.removeSensitiveProperties(requestor, property);
      }
    }
  }
}

export default Base;
