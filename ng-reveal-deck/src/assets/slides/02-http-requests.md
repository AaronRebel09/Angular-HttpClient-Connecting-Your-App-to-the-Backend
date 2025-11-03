### 2) HTTP Requests (GET/POST)
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