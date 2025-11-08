EXERCISE 3
Consume API & Format Data in Angular (Pipes, ViewModels, UI)
Goal

Fetch /posts
Create a ViewModel for the UI (format/derive fields)
Use Angular pipes (titlecase, date, slice/number/currency if relevant)
Build a clean card list with a shared truncate pipe

3.1 Model + Service
File: src/app/core/models/post.model.ts
```ts
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
```
File: src/app/core/services/posts.service.ts
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';
import { catchError, map, retry, shareReplay } from 'rxjs';
import { handleHttpError } from './http-error.util';

export interface PostVm {
  id: number;
  title: string;
  excerpt: string;
  authorLabel: string;
  // demo field just to show formatting; JSONPlaceholder has no dates
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly api = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  getPosts$() {
    return this.http.get<Post[]>(this.api).pipe(
      retry(2),
      map(posts =>
        posts.slice(0, 20).map(p => ({
          id: p.id,
          title: p.title,
          excerpt: p.body,
          authorLabel: `User #${p.userId}`,
          createdAt: new Date(2024, (p.id % 12), (p.id % 28) + 1), // demo dates
        } satisfies PostVm))
      ),
      shareReplay(1),
      catchError(handleHttpError)
    );
  }
}
```
3.2 Shared truncate Pipe
File: src/app/shared/pipes/truncate.pipe.ts
```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true, pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, max = 120, suffix = '…'): string {
    if (!value) return '';
    return value.length > max ? value.slice(0, max).trimEnd() + suffix : value;
  }
}
```
3.3 Card UI (Optional)
File: src/app/shared/ui/card/card.component.ts
```ts
import { Component, Input } from '@angular/core';
import { NgContent } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `
    <article class="card">
      <header><ng-content select="[card-title]"></ng-content></header>
      <section><ng-content></ng-content></section>
      <footer><ng-content select="[card-footer]"></ng-content></footer>
    </article>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent {}
```
3.4 Posts Component (Formatting)
File: src/app/features/posts/posts.component.ts
```ts
import { Component } from '@angular/core';
import { NgFor, DatePipe, TitleCasePipe } from '@angular/common';
import { PostsService } from '../../core/services/posts.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [NgFor, DatePipe, TitleCasePipe, TruncatePipe, CardComponent],
  templateUrl: './posts.component.html',
})
export class PostsComponent {
  posts = toSignal(this.postsService.getPosts$(), { initialValue: [] });
  constructor(private postsService: PostsService) {}
}
```
File: src/app/features/posts/posts.component.html
```
<section>
  <h2>Latest Posts</h2>
  <div class="grid">
    @for (p of posts(); track p.id) {
      <ui-card>
        <h3 card-title>{{ p.title | titlecase }}</h3>
        <p>{{ p.excerpt | truncate:160 }}</p>
        <div card-footer>
          <small>
            {{ p.authorLabel }} · {{ p.createdAt | date:'mediumDate' }}
          </small>
        </div>
      </ui-card>
    }
  </div>
</section>
```
