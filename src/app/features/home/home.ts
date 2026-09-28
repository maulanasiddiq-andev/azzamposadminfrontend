import { Component, signal } from '@angular/core';
import { homeMenus } from '../../core/config/home-menu';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  readonly menus = homeMenus;

  // Only one category can be open at a time
  readonly openCategory = signal<string | null>(null);

  toggle(category: string) {
    this.openCategory.update((current) => (current === category ? null : category));
  }
}
