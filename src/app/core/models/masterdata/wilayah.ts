import { BaseModel } from '../base-model';

export class Wilayah extends BaseModel {
    wilayahId: string = 'tempId';
    kode: string;
    provinsi: string;
    kabupatenKota: string;
    kecamatan: string;
    kelurahan: string;
    kodePos: string;
    display: string;
}