
export class UserNotifikasi {
    userId: string;
    tenantId: string = 'tenantId';
    notifikasiMenungguVerifikasiPembayaranPenjualan: boolean = false;
    notifikasiPembayaranPenjualan: boolean = false;
    notifikasiPembayaranPenjualanDiverifikasi: boolean = false;
    notifikasiPesananPenjualan: boolean = false;
    notifikasiMulaiPengemasanPenjualan: boolean = false;
    notifikasiSudahDikemasPenjualan: boolean = false;
    notifikasiSedangDikirimPenjualan: boolean = false;
    notifikasiTerkirimPenjualan: boolean = false;
    notifikasiCancelPenjualan: boolean = false;
}