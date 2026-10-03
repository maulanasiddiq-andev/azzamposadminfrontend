import { Component, inject, signal } from '@angular/core';
import { JenisAkunService } from '../../../../../../../core/services/akuntansi/jenis-akun-service';
import { ActivatedRoute } from '@angular/router';
import { JenisAkun } from '../../../../../../../core/models/akuntansi/jenis-akun';
import { InfoItem } from '../../../../../../../shared/info-item/info-item';
import { InfoItemToggle } from '../../../../../../../shared/info-item-toggle/info-item-toggle';

@Component({
  imports: [InfoItem, InfoItemToggle],
  selector: 'app-jenis-akun-detail',
  styleUrl: './jenis-akun-detail.scss',
  templateUrl: './jenis-akun-detail.html',
})
export class JenisAkunDetail {
  readonly #jenisAkunService = inject(JenisAkunService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  //JenisAkun ID
  jenisAkunId = this.route.snapshot.paramMap.get('jenisAkunId');

  jenisAkun = signal<JenisAkun | null>(null);

  ngOnInit(): void {
    this.jenisAkun.set(null);
  }

  ngAfterViewInit(): void {
    if (this.id && this.jenisAkunId) {
      this.getJenisAkunById(this.jenisAkunId, this.id);
    }
  }

  getJenisAkunById(jenisAkunId: string, tenantId: string) {
    this.#jenisAkunService.getJenisAkunById(jenisAkunId, tenantId)
      .subscribe((result) => {
        if (result.succeeded) {
          this.jenisAkun.set(result.data);
        }
      });
  }
}
