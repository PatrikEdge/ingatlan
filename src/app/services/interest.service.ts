// src/app/services/interest.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where } from '@angular/fire/firestore';
import { Interest } from '../models/interest.model';
import { collectionData } from '@angular/fire/firestore';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterestService {
  private interestCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.interestCollection = collection(this.firestore, 'interests');
  }

  sendInterest(interest: Interest) {
    return addDoc(this.interestCollection, interest);
  }

  getInterestsByUser(userId: string) {
    const q = query(this.interestCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Interest[]>;
  }
}
