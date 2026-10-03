import { BaseModel } from '../base-model';

export class JenisAkun extends BaseModel {
  jenisAkunId: string = 'tempId';
  nama: string;
  kodeAwal: string;
  kodeConstant: string;
  isActive: boolean = false;
}
