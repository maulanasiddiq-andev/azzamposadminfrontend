import { BaseModel } from '../base-model';

export class Pajak extends BaseModel {
  pajakId: string = 'tempId';
  tenantId: string = 'tenantId';
  nama: string;
  kode: string;
  pemotongan: boolean = false;
  persentase: number;
  isActive: boolean = false;
}