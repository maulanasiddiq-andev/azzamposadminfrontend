import { BaseModel } from '../base-model';

export class GroupPelanggan extends BaseModel {
  groupPelangganId: string = 'tempId';
  tenantId: string = 'tenantId';
  kode: string;
  nama: string;
  isKonsinyasi: boolean = false;
}