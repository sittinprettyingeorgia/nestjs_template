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
