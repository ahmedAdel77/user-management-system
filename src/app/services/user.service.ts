// Angular
import { Injectable } from '@angular/core';
// Rxjs
import { Observable, of } from 'rxjs';
// Models
import { User } from '../models/user.model';
// Enums
import { Status } from '../enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /** users */
  private users: User[] = [
    { id: 1, name: 'Ahmed', email: 'a@test.com', phone: 4353453543, status: Status.ACTIVE },
    { id: 2, name: 'Omar', email: 'b@test.com', phone: 372636722, status: Status.ACTIVE },
    { id: 3, name: 'Ali', email: 'c@test.com', phone: 82736, status: Status.SOFT_DELETED }
  ];

  /** getUsers */
  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  /** addUser
   * @param user User
   */
  addUser(user: User): void {
    // Generate a unique id
    const maxId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) : 0;
    user.id = maxId + 1;
    // Set the user status to ACTIVE
    user.status = Status.ACTIVE;
    this.users.push(user);
  }

  /** updateUser
   * @param updatedUser User
   */
  updateUser(updatedUser: User): void {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = { ...updatedUser };
    }
  }

  /**
   * deleteUser
   * @param userId number
   */
  deleteUser(userId: number): void {
    const user = this.users.find(user => user.id === userId);
    if (user) user.status = Status.SOFT_DELETED;
  }
}
