// users.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';           // ✅ REQUIRED for ngModel/ngForm
import { UsersService, User } from './services/users';


@Component({
  selector: 'app-users',
  standalone: true,
  // ✅ No NgIf/NgFor imports needed with the new control-flow
  imports: [FormsModule],
  template: `
    <h2>HTTP Demo</h2>

    <form (ngSubmit)="addUser()" #f="ngForm" style="margin-bottom:1rem;">
      <input name="name" [(ngModel)]="newName" placeholder="Name" required />
      <input name="email" [(ngModel)]="newEmail" placeholder="Email" required />
      <button type="submit" [disabled]="f.invalid">Create (POST)</button>
    </form>

    <button (click)="load()">Reload (GET)</button>

    @if (users.length) {
      <ul>
        @for (u of users; track u.id) {
          <li><strong>{{ u.name }}</strong> — {{ u.email }}</li>
        }
      </ul>
    } @else {
      <ng-template>Loading...</ng-template>
    }
  `,
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  newName = '';
  newEmail = '';

  constructor(private usersSvc: UsersService) {}

  ngOnInit() { this.load(); }

  load() {
    this.users = [];
    this.usersSvc.getUsers(5).subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('GET error', err),
    });
  }

  addUser() {
    const payload = { name: this.newName, email: this.newEmail };
    this.usersSvc.createUser(payload).subscribe({
      next: (u) => {
        // JSONPlaceholder echoes a resource; prepend for demo
        this.users = [u as User, ...this.users];
        this.newName = this.newEmail = '';
      },
      error: (err) => console.error('POST error', err),
    });
  }
}