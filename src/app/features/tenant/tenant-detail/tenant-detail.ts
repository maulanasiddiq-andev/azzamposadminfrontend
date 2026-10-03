import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Tenant } from '../../../core/models/masterdata/tenant';
import { TenantService } from '../../../core/services/masterdata/tenant-service';
import { DatePipe } from '@angular/common';
import { homeMenus } from '../../../core/config/home-menu';
import { InfoItem } from '../../../shared/info-item/info-item';
import { InfoItemToggle } from '../../../shared/info-item-toggle/info-item-toggle';

@Component({
  imports: [DatePipe, RouterLink, InfoItem, InfoItemToggle],
  selector: 'app-tenant-detail',
  styleUrl: './tenant-detail.scss',
  templateUrl: './tenant-detail.html',
})
export class TenantDetail implements OnInit, AfterViewInit {
  readonly #tenantService = inject(TenantService);
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  tenant = signal<Tenant | null>(null);

  // Tenant Features Menu
  readonly menus = homeMenus;
  
  // Only one category can be open at a time
  readonly openCategory = signal<string | null>(null);
  
  toggle(category: string) {
    this.openCategory.update((current) => (current === category ? null : category));
  }

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
