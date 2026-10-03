import { BaseModel } from '../base-model';

export class Role extends BaseModel {
  roleId: string = 'roleId';
  tenantId: string = 'tenantId';
  name: string;
  roleName: string;
  moduls: [];
}
