/**
 * Access Level is what will be compared between to IBase implementations.
 * If data.accessLevel1 = 'public' and data.accessLevel2 = 'private',
 * data.accessLevel1 cannot access data.accessLevel2 but data.accessLevel2 can access data.accessLevel1
 */
export type AccessLevel = 'public' | 'private' | 'secret' | 'critical';
export type Access = 'read' | 'write' | 'update' | 'create';

export interface IBase {
  readonly access: Access;
  readonly accessLevel: AccessLevel;
  readonly id: string;
  isArchived: boolean | null;
  updatedBy: number;
  updatedOn: number;
  createdBy: number;
  createdOn: number;
  willAllowAccessTo: (requestor: IBase, model?: IBase) => void;
}

export default IBase;
