import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  imports: [NgClass],
  selector: 'app-status-badge',
  styleUrl: './status-badge.scss',
  templateUrl: './status-badge.html',
})
export class StatusBadge {
  readonly value = input<string>('Active');
}
