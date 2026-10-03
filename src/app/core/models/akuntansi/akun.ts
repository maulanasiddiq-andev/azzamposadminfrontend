import { BaseModel } from "../base-model";
import { JenisAkun } from "./jenis-akun";
import { Pajak } from "./pajak";

export class Akun extends BaseModel {
  akunId: string = "tempId";
  tenantId: string = "tenantId";
  jenisAkunId: string;
  pajakId: string;
  nama: string;
  nomorAkun: string; //kode
  childOfAkunId: string;
  coaId: string;
  coa: any;
  mataUang: string = "IDR";
  namaBank: string;
  nomorRekening: string;
  namaPemilik: string;
  isAkunBank: boolean = false;
  isForPenjualan: boolean = false;
  isForPembelian: boolean = false;
  isForCashIn: boolean = false;
  isForCashOut: boolean = false;
  isTopParent: boolean = false;
  isSubParent: boolean = false;
  isActive: boolean = false;
  saldo: number;
  pajak: Pajak;
  jenisAkun: JenisAkun = new JenisAkun();
  childOf: Akun;
}
