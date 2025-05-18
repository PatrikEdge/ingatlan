import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private collectionName = 'users';

  constructor(private firestore: Firestore) {}

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, this.collectionName);
    return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }

  getUserById(id: string): Observable<User | undefined> {
    const userDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(userDoc, { idField: 'id' }) as Observable<User | undefined>;
  }

  addUser(user: User): Promise<void> {
    const userDoc = doc(this.firestore, `${this.collectionName}/${user.id}`);
    return setDoc(userDoc, user);
  }

  updateUser(id: string, data: Partial<User>): Promise<void> {
    const userDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(userDoc, data);
  }

  deleteUser(id: string): Promise<void> {
    const userDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(userDoc);
  }

  logTestUser(): void {
    const testUser = {
      firstName: 'Teszt',
      lastName: 'User',
      email: 'teszt@example.com'
    };
    const usersRef = collection(this.firestore, this.collectionName);
    // Új dokumentum létrehozása véletlenszerű ID-val
    setDoc(doc(usersRef), testUser)
      .then(() => console.log('✅ Teszt user hozzáadva'))
      .catch(err => console.error('❌ Teszt hiba:', err));
  }
}
