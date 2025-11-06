## Tech Talk: Backend Communication with Angular

**Agenda**
1. Introduction to `HttpClientModule` / `provideHttpClient` | (GET, POST) `async`
2. Observable (`subscribe`) 
3. What is RxJS ? Why They Matter Today? Bonus Track : `Signal` Error Handling Patterns
4. Example: Consume a Simple API & Display Data

---

## 1) Introduction to HttpClient

- `HttpClient` lives in **@angular/common/http**
- Two ways to enable it:

### A) Module-based apps (classic)
```ts
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, HttpClientModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
---
### B) Standalone Components (Angular 15+ / 16)
```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
});
```
---
### HTTP Requests (GET/POST)
```ts
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly API = 'https://jsonplaceholder.typicode.com';
  constructor(private http: HttpClient) {}
}