import { Component, inject } from '@angular/core';
import { LoadingService } from '../../core/services/loading-service';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  selector: 'app-loading',
  styleUrl: './loading.scss',
  templateUrl: './loading.html',
})
export class Loading {
  protected readonly loader = inject(LoadingService);
}
