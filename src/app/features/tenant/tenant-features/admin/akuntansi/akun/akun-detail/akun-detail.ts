import { Component, inject, signal } from '@angular/core';
import { AkunService } from '../../../../../../../core/services/akuntansi/akun-service';
import { ActivatedRoute } from '@angular/router';
import { Akun } from '../../../../../../../core/models/akuntansi/akun';
import { InfoItem } from '../../../../../../../shared/info-item/info-item';
import { InfoItemToggle } from '../../../../../../../shared/info-item-toggle/info-item-toggle';

@Component({
  imports: [InfoItem, InfoItemToggle],
  selector: 'app-akun-detail',
  styleUrl: './akun-detail.scss',
  templateUrl: './akun-detail.html',
})
export class AkunDetail {
  readonly #akunService = inject(AkunService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  //Akun ID
  akunId = this.route.snapshot.paramMap.get('akunId');

  akun = signal<Akun | null>(null);

  ngOnInit(): void {
    this.akun.set(null);
  }

  ngAfterViewInit(): void {
    if (this.id && this.akunId) {
      this.getAkunById(this.akunId, this.id);
    }
  }

  getAkunById(akunId: string, tenantId: string) {
    this.#akunService.getAkunById(akunId, tenantId)
      .subscribe((result) => {
        if (result.succeeded) {
          this.akun.set(result.data);
        }
      });
  }
}
