// Angular
import { Injectable } from '@angular/core';
// Rxjs
import { BehaviorSubject, map, Observable } from 'rxjs';
// Enums
import { Role } from '../enums/role.enum';
// Models
import { AuthUser } from '../models/authUser.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** users */
  private users: AuthUser[] = [
    { username: 'admin', email: 'admin@test.com', password: 'admin123', role: Role.ADMIN },
    { username: 'user', email: 'user@test.com', password: 'user123', role: Role.USER }
  ];

  /** userSubject */
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  /** user$ */
  user$: Observable<AuthUser | null> = this.userSubject.asObservable();

  constructor() {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      this.userSubject.next(storedUser);
    }
  }

  login(email: string, password: string): void {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    }
  }

  /** logout */
  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  /** logout */
  getUser(): Observable<AuthUser | null> {
    return this.user$;
  }

  /** isAuthenticated */
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => user !== null));
  }

  /** getRole */
  getRole(): Observable<Role | ""> {
    return this.user$.pipe(map(user => user?.role || ''));
  }
}
