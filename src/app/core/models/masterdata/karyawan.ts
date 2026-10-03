import { BaseModel } from '../base-model';
import { User } from '../identity/user';
import { Gudang } from './gudang';
import { Jabatan } from './jabatan';
import { Wilayah } from './wilayah';

export class Karyawan extends BaseModel {
    karyawanId: string = 'tempId';
    tenantId: string = 'tenantId';
    jabatanId: string;
    userId: string;
    gudangId: string;
    nama: string;
    kode: string;
    noWa: string;
    noHp: string;
    telegram: string;
    telegramChatId: string;
    email: string;
    alamat: string;
    tanggalLahir: Date = new Date();
    tanggalJoin: Date = new Date();
    wilayahId: string;
    namaBank: string;
    noRekening: string;
    namaPemilik: string;
    jabatan: Jabatan = new Jabatan();
    user: User = new User();
    gudang: Gudang = new Gudang();
    wilayah: Wilayah = new Wilayah();
    alamatLengkap: string;
}