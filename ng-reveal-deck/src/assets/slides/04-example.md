###  4) Example: Consume API & Display Data
```ts
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly API = 'https://jsonplaceholder.typicode.com';
  constructor(private http: HttpClient) {}

  getUsers(limit = 5): Observable<User[]> {
    const params = new HttpParams().set('_limit', limit);
    return this.http.get<User[]>(`${this.API}/users`, { params });
  }

  createUser(payload: Partial<User>): Observable<User> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<User>(`${this.API}/users`, payload, { headers });
  }
}