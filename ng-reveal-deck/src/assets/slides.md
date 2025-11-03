## Backend Communication with Angular: HttpClient

**Agenda**
1. Introduction to `HttpClientModule` / `provideHttpClient`
2. HTTP Requests (GET, POST)
3. Observable Handling (`subscribe`)
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