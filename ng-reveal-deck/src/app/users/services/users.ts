// users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly API = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getUsers(limit = 5): Observable<User[]> {
    const params = new HttpParams().set('_limit', limit);
    return this.http.get<User[]>(`${this.API}/users`, { params });
  }

  
createUser(payload: Partial<User>) {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.post<User>(`${this.API}/users`, payload, { headers });
}

}