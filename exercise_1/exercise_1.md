EXERCISE 1
Http + Async Observables + Signals in Angular Components
Goal

Use HttpClient to GET /users
Keep the data as an Observable in the service
In the component, bridge to Signals with toSignal()
Handle loading, error, and retry properly


1.1 Models
File: src/app/core/models/user.model.ts
```ts
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}
```
1.2 HTTP Error Utility
File: src/app/core/services/http-error.util.ts
```ts
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleHttpError(err: HttpErrorResponse) {
  const message =
    err.error?.message || err.message || `HTTP ${err.status} ${err.statusText}`;
  // In real apps, map status codes to user-friendly messages
  return throwError(() => new Error(message));
}
```

1.3 Users Service (Observable-first)
File: src/app/core/services/users.service.ts
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { catchError, retry, shareReplay } from 'rxjs';
import { handleHttpError } from './http-error.util';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  /** Returns cold observable. Consumers decide when/how to subscribe */
  getUsers$() {
    return this.http.get<User[]>(this.api).pipe(
      retry(2),               // transient errors
      shareReplay({ bufferSize: 1, refCount: false }), // cache response
      catchError(handleHttpError)
    );
  }
}
```
1.4 Interceptors (Optional but Great for Demos)
File: src/app/core/interceptors/logging.interceptor.ts
```ts
import { HttpInterceptorFn } from '@angular/common/http';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = performance.now();
  return next(req).pipe({
    finalize() {
      const ms = (performance.now() - started).toFixed(0);
      console.info(`[HTTP] ${req.method} ${req.urlWithParams} - ${ms}ms`);
    }
  } as any);
};
```
File: src/app/core/interceptors/error.interceptor.ts
TypeScriptimport { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
```ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // You could also inject MatSnackBar via a service facade
      console.error('[HTTP ERROR]', err);
      return throwError(() => err);
    })
  );
};
```
Tip: In Angular 16+, function-based HttpInterceptorFn is preferred over classes.

1.5 Users Component – Convert Observable → Signal
File: src/app/features/users/users.component.ts
```ts
import { Component, signal, computed } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { UsersService } from '../../core/services/users.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  // UI state signals
  loading = signal(true);
  error = signal<string | null>(null);

  // Convert observable to signal; initialValue avoids "undefined" while pending
  users = toSignal(this.usersService.getUsers$(), { initialValue: [], rejectErrors: true });

  // derived signal: simple count
  total = computed(() => this.users().length);

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    // When users() first computes, we consider loading false
    queueMicrotask(() => this.loading.set(false));
  }
}
```
File: src/app/features/users/users.component.html
(Angular v17+ control flow; if on v16, use *ngIf/*ngFor)
```
<section class="users">
  @if (loading()) {
    <p>Loading users…</p>
  } @else if (error()) {
    <p class="error">{{ error() }}</p>
  } @else {
    <h2>Users ({{ total() }})</h2>
    <ul>
      @for (u of users(); track u.id) {
        <li>
          <strong>{{ u.name }}</strong>
          <div>@{{ u.username }} · {{ u.email }}</div>
        </li>
      }
    </ul>
  }
</section>
```
Good practices

Service exposes Observables (shareable & composable).
Component adapts to Signals for fine-grained view updates.
Avoid manual subscribe() in components—prefer async pipe or toSignal().
Handle retries at the service layer.


Run it:
npm start       # or: ng serve -o
