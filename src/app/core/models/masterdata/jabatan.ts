import { BaseModel } from '../base-model';

export class Jabatan extends BaseModel {
    jabatanId: string = 'tempId';
    tenantId: string = 'tenantId';
    kode: string;
    nama: string;
    tanggungJawab: string;
}