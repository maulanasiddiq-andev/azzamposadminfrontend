import { BaseModel } from '../base-model';
import { Akun } from './akun';

export class MappingAkun extends BaseModel {
  mappingAkunId: string = 'tempId';
  tenantId: string = 'tenantId';
  akunId: string;
  mappingConstant: string; //
  kode: string;
  isActive: boolean = false;
  akun: Akun = new Akun();
}