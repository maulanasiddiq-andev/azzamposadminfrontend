import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-info-item-toggle',
  styleUrl: './info-item-toggle.scss',
  templateUrl: './info-item-toggle.html',
})
export class InfoItemToggle {
  readonly title = input<string>('');
  readonly value = input<boolean | undefined | null>(false);
}
