import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../../../../../core/services/identity/user-service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../../../../core/models/identity/user';
import { InfoItem } from '../../../../../../../shared/info-item/info-item';
import { InfoItemToggle } from '../../../../../../../shared/info-item-toggle/info-item-toggle';

@Component({
  imports: [InfoItem, InfoItemToggle],
  selector: 'app-user-detail',
  styleUrl: './user-detail.scss',
  templateUrl: './user-detail.html',
})
export class UserDetail {
  readonly #userService = inject(UserService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id');

  //User ID
  userId = this.route.snapshot.paramMap.get('userId');

  user = signal<User | null>(null);

  ngOnInit(): void {
    this.user.set(null);
  }

  ngAfterViewInit(): void {
    if (this.id && this.userId) {
      this.getUserById(this.userId, this.id);
    }
  }

  getUserById(userId: string, tenantId: string) {
    this.#userService.getUserById(userId, tenantId)
      .subscribe((result) => {
        if (result.succeeded) {
          this.user.set(result.data);
        }
      });
  }
}
