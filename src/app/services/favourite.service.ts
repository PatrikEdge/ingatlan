import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, deleteDoc, query, where, limit, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Favorite } from '../models/favourite.model';
import { FirestoreDataConverter, CollectionReference, QueryDocumentSnapshot } from 'firebase/firestore';

// Konverter
const favoriteConverter: FirestoreDataConverter<Favorite> = {
  toFirestore(fav: Favorite) {
    return {
      userId: fav.userId,
      propertyId: fav.propertyId,
      addedAt: fav.addedAt
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Favorite {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      userId: data['userId'],
      propertyId: data['propertyId'],
      addedAt: data['addedAt']?.toDate ? data['addedAt'].toDate() : data['addedAt']
    };
  }
};

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private favoritesCollection: CollectionReference<Favorite>;

  constructor(private firestore: Firestore) {
    this.favoritesCollection = collection(this.firestore, 'favorites').withConverter(favoriteConverter);
  }

  addFavorite(favorite: Favorite): Promise<void> {
    const newDocRef = doc(this.favoritesCollection);
    favorite.id = newDocRef.id;
    favorite.addedAt = new Date();
    return setDoc(newDocRef, favorite);
  }

  removeFavorite(favoriteId: string): Promise<void> {
    const docRef = doc(this.firestore, `favorites/${favoriteId}`);
    return deleteDoc(docRef);
  }

  getFavoriteByUserAndProperty(userId: string, propertyId: string): Observable<Favorite | undefined> {
    const q = query(
      this.favoritesCollection,
      where('userId', '==', userId),
      where('propertyId', '==', propertyId),
      limit(1)
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map(favorites => favorites.length ? favorites[0] : undefined)
    );
  }

  getFavoritesByUser(userId: string): Observable<Favorite[]> {
    const q = query(this.favoritesCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' });
  }
}
