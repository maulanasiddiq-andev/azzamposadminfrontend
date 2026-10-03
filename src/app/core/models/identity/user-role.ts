import { RecordStatus } from "../../enums/record-status.enum";

export class UserRole {
  userRoleId: string;
  tenantId: string = 'tenantId';
  roleId: string;
  userId: string;
  rolename: string;
  username: string;
  deskripsi: string;
  recordStatus: string = RecordStatus.Active;
}
