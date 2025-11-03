import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UsersService, User } from '../users/services/users';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-async',
  standalone: true,
  imports: [AsyncPipe], // ✅ Required for async pipe
  templateUrl: './users-async.component.html' // ✅ We'll use a separate HTML file
})
export class UsersAsyncComponent {
  // ✅ Observable property exposed to the template
  users$!: Observable<User[]>; // declare first (definite assignment)

  
constructor(private usersSvc: UsersService) {          // DI happens here
    this.users$ = this.usersSvc.getUsers(5);             // safe to use now
  }

}
