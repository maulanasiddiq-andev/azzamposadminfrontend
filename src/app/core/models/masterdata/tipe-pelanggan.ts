import { BaseModel } from '../base-model';

export class TipePelanggan extends BaseModel {
    tipePelangganId: string = 'tempId';
    tenantId: string = 'tenantId';
    kode: string;
    nama: string;
}