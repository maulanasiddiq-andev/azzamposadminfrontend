import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tenant } from '../../../core/models/masterdata/tenant';
import { TenantService } from '../../../core/services/masterdata/tenant-service';

@Component({
  imports: [],
  selector: 'app-tenant-detail',
  styleUrl: './tenant-detail.scss',
  templateUrl: './tenant-detail.html',
})
export class TenantDetail implements OnInit, AfterViewInit {
  readonly #tenantService = inject(TenantService);
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  tenant = signal<Tenant | null>(null);

  ngOnInit(): void {
    this.tenant.set(null);
  }

  ngAfterViewInit(): void {
    if (this.id) {
      this.getTenantById(this.id);
    }
  }

  getTenantById(id: string) {
    this.#tenantService.getTenantById(id)
      .subscribe((result) => {
        console.log(result.data)
        if (result.succeeded) {
          this.tenant.set(result.data);
        }
      });
  }
}
