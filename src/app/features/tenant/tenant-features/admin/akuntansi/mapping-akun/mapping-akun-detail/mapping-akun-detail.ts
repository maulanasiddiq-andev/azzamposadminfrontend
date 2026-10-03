import { Component, inject, signal } from '@angular/core';
import { MappingAkunService } from '../../../../../../../core/services/akuntansi/mapping-akun-service';
import { ActivatedRoute } from '@angular/router';
import { MappingAkun } from '../../../../../../../core/models/akuntansi/mapping-akun';
import { InfoItem } from '../../../../../../../shared/info-item/info-item';
import { InfoItemToggle } from '../../../../../../../shared/info-item-toggle/info-item-toggle';

@Component({
  imports: [InfoItem, InfoItemToggle],
  selector: 'app-mapping-akun-detail',
  styleUrl: './mapping-akun-detail.scss',
  templateUrl: './mapping-akun-detail.html',
})
export class MappingAkunDetail {
  readonly #mappingAkunService = inject(MappingAkunService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  //MappingAkun ID
  mappingAkunId = this.route.snapshot.paramMap.get('mappingAkunId');

  mappingAkun = signal<MappingAkun | null>(null);

  ngOnInit(): void {
    this.mappingAkun.set(null);
  }

  ngAfterViewInit(): void {
    if (this.id && this.mappingAkunId) {
      this.getMappingAkunById(this.mappingAkunId, this.id);
    }
  }

  getMappingAkunById(mappingAkunId: string, tenantId: string) {
    this.#mappingAkunService.getMappingAkunById(mappingAkunId, tenantId)
      .subscribe((result) => {
        if (result.succeeded) {
          this.mappingAkun.set(result.data);
        }
      });
  }
}
