Commands to Run (per exercise)

# Start dev server
ng serve -o

# Lint & fix
ng lint
ng lint --fix

# Build
ng build

# Run unit tests
ng test

Validations & Testing
Http Testing (Angular 16+)
Use provideHttpClientTesting() for tests with standalone apps.
Example: users.service.spec.ts

```ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { User } from '../models/user.model';

describe(UsersService.name, () => {
  let svc: UsersService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UsersService
      ]
    });
    svc = TestBed.inject(UsersService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should GET users', () => {
    const mock: User[] = [{ id: 1, name: 'Leanne', username: 'Bret', email: 'l@x.com' }];
    svc.getUsers$().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Leanne');
    });

    const req = http.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    http.verify();
  });
});
```

Tips, Tricks & Good Practices
HttpClient & Observables

Service returns Observables (cold, composable, testable).
Use shareReplay(1) for caching idempotent GETs.
retry(n) only for transient GETs; avoid for POST/PUT/DELETE unless idempotent.
Centralize error mapping; avoid leaking raw backend messages to UI.

Signals & Interop

Use toSignal() in components for view reactivity; prefer derived UI state with computed().
For side-effects (logging/analytics), use effect().
For existing Observables (HTTP, forms, router), interop with @angular/core/rxjs-interop.

RxJS

switchMap for search, route params, or any cancelable workflow.
mergeMap for parallelism; concatMap for ordering.
Debounce noisy inputs; distinctUntilChanged() to cut duplicates.
Keep catchError close to the consumer; don’t break shared streams unexpectedly.

Interceptors

Add auth headers, correlation IDs, logging, and retry (if policy-based) in interceptors.
Keep interceptors side-effect free; defer UI concerns to a UI service (e.g., snackbars).

Code Quality

ESLint + Prettier + strict TypeScript.
Use models/interfaces for API types.
Encapsulate ViewModels in services to keep components slim.
Prefer standalone components + feature routing for modularity.

Live Demo Flow (recommended)

Start with Users list (Exercise 1).
Add Search and showcase debounce + switchMap cancellation (Exercise 2).
Show Posts with formatting and pipes (Exercise 3).
Open DevTools → Network to show interceptor logs & request timing.