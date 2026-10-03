import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from '../../../../../../../core/services/identity/role-service';
import { Role } from '../../../../../../../core/models/identity/role';
import { InfoItem } from '../../../../../../../shared/info-item/info-item';
import { InfoItemToggle } from '../../../../../../../shared/info-item-toggle/info-item-toggle';

@Component({
  imports: [InfoItem, InfoItemToggle],
  selector: 'app-role-detail',
  styleUrl: './role-detail.scss',
  templateUrl: './role-detail.html',
})
export class RoleDetail {
  readonly #roleService = inject(RoleService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  //Role ID
  roleId = this.route.snapshot.paramMap.get('roleId');

  role = signal<Role | null>(null);

  ngOnInit(): void {
    this.role.set(null);
  }

  ngAfterViewInit(): void {
    if (this.id && this.roleId) {
      this.getRoleById(this.roleId, this.id);
    }
  }

  getRoleById(roleId: string, tenantId: string) {
    this.#roleService.getRoleById(roleId, tenantId)
      .subscribe((result) => {
        console.log(result.data)
        if (result.succeeded) {
          this.role.set(result.data);
        }
      });
  }
}
