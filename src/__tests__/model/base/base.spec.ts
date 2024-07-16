// Adjust the import path as necessary
import IBase from '@interface/base';
import Base from '@model/base';

describe('Base', () => {
  let base: Base;

  beforeEach(() => {
    base = new Base('read', 'private');
  });

  describe('constructor', () => {
    it('should create a new Base instance with correct properties', () => {
      expect(base.access).toBe('read');
      expect(base.accessLevel).toBe('private');
      expect(base.id).toBeDefined();
      expect(base.isArchived).toBe(false);
      expect(base.updatedBy).toBeDefined();
      expect(base.updatedOn).toBeDefined();
      expect(base.createdBy).toBeDefined();
      expect(base.createdOn).toBeDefined();
    });
  });

  describe('toString', () => {
    it('should return a JSON string representation of the object', () => {
      const stringified = base.toString();
      expect(JSON.parse(stringified)).toMatchObject({
        id: base.id,
        access: 'read',
        accessLevel: 'private',
        isArchived: false,
      });
    });
  });

  describe('willAllowAccessTo', () => {
    it('should allow access when requestor has sufficient permissions', () => {
      const requestor: IBase = new Base('read', 'critical');
      expect(() => base.willAllowAccessTo(requestor, 'read')).not.toThrow();
    });

    it('should throw an error when requestor has insufficient access level', () => {
      const requestor: IBase = new Base('read', 'public');
      expect(() => base.willAllowAccessTo(requestor, 'read')).toThrow(
        'Access Denied',
      );
    });

    it('should throw an error when requestor has insufficient access type', () => {
      const requestor: IBase = new Base('read', 'critical');
      expect(() => base.willAllowAccessTo(requestor, 'write')).toThrow(
        'Access Denied',
      );
    });

    it('should allow write access when requestor has write permissions', () => {
      const requestor: IBase = new Base('write', 'critical');
      expect(() => base.willAllowAccessTo(requestor, 'write')).not.toThrow();
    });

    it('should allow update access when requestor has update permissions', () => {
      const requestor: IBase = new Base('update', 'critical');
      expect(() => base.willAllowAccessTo(requestor, 'update')).not.toThrow();
    });

    it('should allow create access when requestor has create permissions', () => {
      const requestor: IBase = new Base('create', 'critical');
      expect(() => base.willAllowAccessTo(requestor, 'create')).not.toThrow();
    });
  });

  describe('removeSensitiveProperties', () => {
    it('should remove properties that the requestor does not have access to', () => {
      const sensitiveBase = new Base('write', 'critical');
      sensitiveBase['sensitiveField'] = 'secret';

      const requestor: IBase = new Base('read', 'private');

      // We need to call willAllowAccessTo to trigger removeSensitiveProperties
      const result = sensitiveBase.willAllowAccessTo(requestor, 'read');

      expect(result?.data['sensitiveField']).toBeNull();
    });
  });
});
