import { Service } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';

@Service()
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable().pipe(delay(1));

  constructor() { }

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }
}
