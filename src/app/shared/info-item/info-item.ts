import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-info-item',
  styleUrl: './info-item.scss',
  templateUrl: './info-item.html',
})
export class InfoItem {
  readonly title = input<string>('');
  readonly value = input<string | undefined | null>('');
}
