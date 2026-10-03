import { Component, ElementRef, input, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-search-bar',
  styleUrl: './search-bar.scss',
  templateUrl: './search-bar.html',
})
export class SearchBar {
  readonly control = input.required<FormControl<string>>();
  readonly placeholder = input('Search');
  readonly label = input('Search');

  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  clearSearch() {
    this.control().reset(); // back to '' for a non-nullable control
    this.searchInput().nativeElement.focus();
  }
}
