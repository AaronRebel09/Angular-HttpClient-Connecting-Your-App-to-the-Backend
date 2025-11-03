import { Routes } from '@angular/router';
import { SlidesComponent } from './slides/slides.component';
import { UsersAsyncComponent } from './users/users-async.component';

export const routes: Routes = [
  { path: 'slides', component: SlidesComponent },
  { path: '', pathMatch: 'full', redirectTo: 'slides' },
  { path: 'demo-async', component: UsersAsyncComponent },
];
