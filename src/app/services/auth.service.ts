import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private userService: UserService
  ) {}

  register(user: User, password: string): Observable<User> {
    if (!user.email || !password) {
      return throwError(() => new Error('Email és jelszó kötelező'));
    }
    return from(createUserWithEmailAndPassword(this.auth, user.email, password)).pipe(
      switchMap(cred => {
        if (!cred.user) return throwError(() => new Error('Felhasználó létrehozása sikertelen'));

        const newUser: User = {
          id: cred.user.uid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };

        return from(this.userService.addUser(newUser)).pipe(
          map(() => newUser),
          catchError(err => throwError(() => err))
        );
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(cred => {
        if (!cred.user) throw new Error('User not found');
        return { id: cred.user.uid, email: cred.user.email ?? '', firstName: '', lastName: '' } as User;
      })
    );
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  isLoggedIn(): Observable<boolean> {
    return authState(this.auth).pipe(map(user => !!user));
  }

  getCurrentUser(): Observable<User | null> {
    return authState(this.auth).pipe(
      map(user => user ? { id: user.uid, email: user.email ?? '', firstName: '', lastName: '' } : null)
    );
  }
}
