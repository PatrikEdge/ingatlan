import { Injectable } from '@angular/core';
import { Firestore, collection, doc, docData, setDoc, updateDoc, deleteDoc, collectionData, FirestoreDataConverter, QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { Property } from '../models/property.model';
import { Observable } from 'rxjs';

const propertyConverter: FirestoreDataConverter<Property> = {
  toFirestore(property: Property): DocumentData {
    return {
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price,
      type: property.type,
      size: property.size,
      createdAt: property.createdAt,
      ownerId: property.ownerId
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Property {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data['title'],
      description: data['description'],
      location: data['location'],
      price: data['price'],
      type: data['type'],
      size: data['size'],
      createdAt: data['createdAt']?.toDate ? data['createdAt'].toDate() : data['createdAt'],
      ownerId: data['ownerId']
    };
  }
};

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private propertiesCollection;

  constructor(private firestore: Firestore) {
    this.propertiesCollection = collection(this.firestore, 'properties').withConverter(propertyConverter);
  }

  getProperties(): Observable<Property[]> {
    return collectionData(this.propertiesCollection, { idField: 'id' }) as Observable<Property[]>;
  }

  getPropertyById(id: string): Observable<Property> {
    const docRef = doc(this.propertiesCollection, id).withConverter(propertyConverter);
    return docData(docRef, { idField: 'id' }) as Observable<Property>;
  }      

  addProperty(property: Property): Promise<void> {
    const newDocRef = doc(this.propertiesCollection); // automatikus ID
    property.id = newDocRef.id;
    return setDoc(newDocRef, property);
  }

  updateProperty(id: string, data: Partial<Property>): Promise<void> {
    const docRef = doc(this.propertiesCollection, id);
    return updateDoc(docRef, data);
  }

  deleteProperty(id: string): Promise<void> {
    const docRef = doc(this.propertiesCollection, id);
    return deleteDoc(docRef);
  }
}
