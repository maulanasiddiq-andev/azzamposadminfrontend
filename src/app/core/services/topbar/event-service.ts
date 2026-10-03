import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import type {
  LayoutColor,
  LayoutType,
  LayoutWidth,
  SideBarTheme,
  SideBarWidth,
} from '../../models/topbar/layout.model';
import { LayoutEventType } from '../../enums/events';

type Payload = LayoutType | LayoutWidth | LayoutColor | SideBarTheme | SideBarWidth | boolean;

interface LayoutEvent {
  readonly type: LayoutEventType;
  readonly payload: Payload;
}

type EventCallback = (payload: Payload) => void;

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly events$ = new Subject<LayoutEvent>();

  /** Broadcast an event to all listeners of `type`. */
  broadcast(type: LayoutEventType, payload: Payload): void {
    this.events$.next({ type, payload });
  }

  /** Stream of payloads for an event type. Works with `takeUntilDestroyed()`, `async` pipe or `toSignal()`. */
  on(type: LayoutEventType): Observable<Payload> {
    return this.events$.pipe(
      filter((event) => event.type === type),
      map((event) => event.payload),
    );
  }

  /** Callback-style subscription (same API as before). Caller must unsubscribe. */
  subscribe(type: LayoutEventType, callback: EventCallback): Subscription {
    return this.on(type).subscribe(callback);
  }
}