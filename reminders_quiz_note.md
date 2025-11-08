✅ Angular HTTP & Observables – Quick Notes
1. Enable HTTP in Angular

NgModule apps: Import HttpClientModule in your root module.
Standalone apps: Use provideHttpClient() in bootstrapApplication().


2. HttpClient Basics

HttpClient.get<T>(url) → returns an Observable (not a Promise).
Common methods: GET (fetch), POST (create), PUT (update), DELETE (remove).


3. Observables vs Promises

Observables: Lazy, can emit multiple values, cancellable via unsubscribe.
Promises: Eager, emit only one value, cannot be cancelled.


4. Subscribe & Async Pipe

Handle Observable values with:

subscribe(...) in code.
async pipe in templates → auto-subscribe & cleanup.




5. Hot vs Cold Observables

Cold: Starts producing values only when subscribed (e.g., http.get()).
Hot: Produces values regardless of subscribers (e.g., Subject).


6. Error Handling

Use catchError(...) inside pipe(...) for clean error handling.
Example:
TypeScriptthis.http.get(...).pipe(  catchError(err => of([])) // fallback);Show more lines



7. Query Params & Headers

Pass query params via { params: { key: value } } or HttpParams.
Angular auto-sets Content-Type: application/json for object bodies in POST.


8. Getting Full Response

Use { observe: 'response' } to access status code, headers, etc.


9. Signals Interop

Convert Observable → Signal with toSignal(observable, { initialValue }).
Default initial value is undefined unless provided.


10. Best Practice for Displaying API Data

Expose users$ = this.http.get<User[]>('/api').
In template:
HTML<div *ngIf="users$ | async as users; else loading">  {{ users | json }}</div><ng-template #loading>Loading...</ng-template>Show more lines



✅ Bonus Operators to Remember

switchMap: Cancels previous request when new one starts.
exhaustMap: Ignores new emissions until current completes.
retry / retryWhen: For transient errors (use carefully).