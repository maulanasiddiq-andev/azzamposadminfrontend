import { BaseModel } from '../base-model';
import { Wilayah } from './wilayah';

export class Gudang extends BaseModel {
    gudangId: string = 'tempId';
    tenantId: string = 'tenantId';
    wilayahId: string;
    kode: string;
    nama: string;
    alamat: string;
    alamatLengkap: string;
    telepon: string;
    isMain: boolean = false;
    isKonsinyasi: boolean = false;
    personInCharge: string;
    email: string;
    wilayah: Wilayah = new Wilayah();
}