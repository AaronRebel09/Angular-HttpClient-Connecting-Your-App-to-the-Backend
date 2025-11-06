## 2) Observables 
 represented by the **`Observable<T>`** class, and which presents a **sequence of values** that are **produced over time**. the basic method provided is `subscribe`, which **accepts an object** whose **properties are set to functions** that **respond** to the **sequence of values**.
---
###  The Observable<T> subscribe argument properties
**next** : This function is invoked when a new value is produced. 
**error** : This function is invoked when an error occurs. 
**complete**  : This function is invoked when the sequence of values ends. 
---
### Why Observables? (subscribe vs async pipe)
- `HttpClient` methods return **cold Observables**:
  - Emit **once** (response) → **complete**
  - Single `subscribe` doesn’t require manual unsubscribe
### `subscribe` (imperative)
---
```ts
// users.component.ts
users: User[] = [];

load() {
  this.usersSvc.getUsers(5).subscribe({
    next: (data) => (this.users = data),
    error: (err) => console.error('GET error', err),
    complete: () => console.log('done'),
  });
}