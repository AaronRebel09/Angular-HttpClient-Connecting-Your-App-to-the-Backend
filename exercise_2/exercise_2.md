EXERCISE 2
RxJS Interaction in Angular (Operators, Streams, Cancellation)
Goal

Add a search box with Reactive Forms
Combine search input with remote data using RxJS operators
Use switchMap to cancel stale requests
Demonstrate debounce, distinctUntilChanged, error fallback


Note: JSONPlaceholder doesn’t support a q query; we’ll fetch once and filter client-side for deterministic demos. Then we’ll show how to swap it to a server-side query.

2.1 Component
File: src/app/features/search/user-search.component.ts
```ts
import { Component, inject, signal, computed, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { UsersService } from '../../core/services/users.service';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './user-search.component.html',
})
export class UserSearchComponent {
  private usersService = inject(UsersService);

  searchCtrl = new FormControl('', { nonNullable: true });
  loading = signal(false);
  error = signal<string | null>(null);

  // Stream of search text
  search$ = this.searchCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged()
  );

  // Source users$ (could be a direct HTTP search if API supports it)
  users$ = this.usersService.getUsers$().pipe(shareReplay(1));

  // Combine and filter client-side
  filtered$ = combineLatest([this.users$, this.search$]).pipe(
    map(([users, q]) => {
      const term = (q ?? '').toLowerCase().trim();
      if (!term) return users;
      return users.filter(u =>
        [u.name, u.username, u.email].some(v => v?.toLowerCase().includes(term))
      );
    }),
    catchError(err => {
      this.error.set(err.message ?? 'Search failed');
      return of([]);
    })
  );

  // Convert to signal for the template
  filtered = toSignal(this.filtered$, { initialValue: [] });

  constructor() {
    // Cancel subscriptions automatically when component is destroyed
    takeUntilDestroyed();

    // Reactively toggle loading when search changes
    effect(() => {
      this.loading.set(true);
      // small microtask: UI shows spinner then filtered() re-evaluates
      queueMicrotask(() => this.loading.set(false));
    });
  }
}
```
File: src/app/features/search/user-search.component.html
```
<section>
  <h2>User Search</h2>

  <input type="search" [formControl]="searchCtrl" placeholder="Search users..." />

  @if (loading()) { <p>Searching…</p> }
  @if (error())    { <p class="error">{{ error() }}</p> }

  <ul>
    @for (u of filtered(); track u.id) {
      <li>
        <strong>{{ u.name }}</strong> (@{{ u.username }}) — {{ u.email }}
      </li>
    }
  </ul>
</section>
```
Server-side search (when API supports it):
```ts
// replace users$ with:
const apiUrl = (q: string) => `https://api.example.com/users?q=${encodeURIComponent(q)}`;
const results$ = this.search$.pipe(
  switchMap(q => this.http.get<User[]>(apiUrl(q)).pipe(
    catchError(() => of([])) // fail soft
  ))
);
```
switchMap cancels prior requests when a new search arrives.


RxJS tips

Prefer switchMap for search and route-based requests.
Use shareReplay(1) to cache results across subscribers.
Put catchError as low as possible to avoid swallowing upstream errors.
Use takeUntilDestroyed() to auto-unsubscribe in components (Angular 16+).