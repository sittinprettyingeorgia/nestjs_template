// Adjust the import path as necessary
import IBase, { Access, AccessLevel } from '@interface/base';
import Base from '@model/base';

describe('Base', () => {
  let base: Base;

  beforeEach(() => {
    base = new Base('create', 'secret');
  });

  describe('constructor', () => {
    it('should create a new Base instance with correct properties', () => {
      expect(base.access).toBe('create');
      expect(base.accessLevel).toBe('secret');
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
        access: 'create',
        accessLevel: 'secret',
        isArchived: false,
      });
    });
  });

  describe('willAllowAccessTo', () => {
    it('should allow access when requestor has sufficient permissions', () => {
      const requestor: IBase = new Base('read', 'critical');
      expect(() => base.willAllowAccessTo(requestor)).not.toThrow();
    });

    it('should throw an error when requestor has insufficient access level', () => {
      const requestor: IBase = new Base('read', 'public');
      expect(() => base.willAllowAccessTo(requestor)).toThrow('Access Denied');
    });

    it('should allow write access when requestor has write permissions', () => {
      const requestor: IBase = new Base('write', 'critical');
      expect(() => base.willAllowAccessTo(requestor)).not.toThrow();
    });

    it('should allow update access when requestor has update permissions', () => {
      const requestor: IBase = new Base('update', 'critical');
      expect(() => base.willAllowAccessTo(requestor)).not.toThrow();
    });

    it('should allow create access when requestor has create permissions', () => {
      const requestor: IBase = new Base('create', 'critical');
      expect(() => base.willAllowAccessTo(requestor)).not.toThrow();
    });
  });

  describe('removeSensitiveProperties', () => {
    let baseObject: Base;
    let requestor: Base;

    beforeEach(() => {
      baseObject = new Base('read' as Access, 'private' as AccessLevel);
      requestor = new Base('read' as Access, 'private' as AccessLevel);
    });

    it('should nullify properties that the requestor does not have access to', () => {
      const sensitiveProperty = new Base(
        'write' as Access,
        'secret' as AccessLevel,
      );
      baseObject['sensitiveField'] = sensitiveProperty;

      const result = baseObject.willAllowAccessTo(requestor);

      expect(result).toBeDefined();
      expect(result?.data?.['sensitiveField']).toBeNull();
    });

    it('should keep properties that the requestor has access to', () => {
      const accessibleProperty = new Base(
        'read' as Access,
        'private' as AccessLevel,
      );
      baseObject['accessibleField'] = accessibleProperty;

      const result = baseObject.willAllowAccessTo(requestor);

      expect(result).toBeDefined();
      expect(result?.data?.['accessibleField']).toBeInstanceOf(Base);
    });

    it('should handle nested properties correctly', () => {
      const nestedBase = new Base('read' as Access, 'private' as AccessLevel);
      nestedBase['nestedField'] = new Base(
        'write' as Access,
        'private' as AccessLevel,
      );
      baseObject['nestedObject'] = nestedBase;

      const result = baseObject.willAllowAccessTo(requestor);

      expect(result).toBeDefined();
      expect(result?.data?.['nestedObject']).toBeInstanceOf(Base);
      expect(result?.data?.['nestedObject']?.['nestedField']).toBeNull();
    });

    it('should throw an error if requestor does not have access to the base object', () => {
      const lowPrivilegeRequestor = new Base(
        'read' as Access,
        'public' as AccessLevel,
      );

      expect(() => baseObject.willAllowAccessTo(lowPrivilegeRequestor)).toThrow(
        'Access Denied',
      );
    });

    // it('should not modify non-Base properties', () => {
    //   baseObject['stringField'] = 'Hello';
    //   baseObject['numberField'] = 42;

    //   const result = baseObject.willAllowAccessTo(requestor);

    //   expect(result).toBeDefined();
    //   expect(result.data['stringField']).toBe('Hello');
    //   expect(result.data['numberField']).toBe(42);
    // });

    // it('should handle properties with same access level but different access type', () => {
    //   const writeProperty = new Base(
    //     'write' as Access,
    //     'private' as AccessLevel,
    //   );
    //   baseObject['writeField'] = writeProperty;

    //   const result = baseObject.willAllowAccessTo(requestor);

    //   expect(result).toBeDefined();
    //   expect(result.data['writeField']).toBeNull();
    // });
  });
});
