import { Injectable } from '@angular/core';
import { Firestore, collection, doc, docData, getDocs, setDoc, updateDoc, deleteDoc, collectionData, FirestoreDataConverter, QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { Property } from '../models/property.model';
import { Observable } from 'rxjs';
import { query, where } from '@angular/fire/firestore';

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

  getProperties(filters?: { minPrice?: number; maxPrice?: number; minSize?: number; maxSize?: number }): Observable<Property[]> {
    let q = query(this.propertiesCollection);
  
    if (filters) {
      if (filters.minPrice !== undefined) {
        q = query(q, where('price', '>=', filters.minPrice));
      }
      if (filters.maxPrice !== undefined) {
        q = query(q, where('price', '<=', filters.maxPrice));
      }
      if (filters.minSize !== undefined) {
        q = query(q, where('size', '>=', filters.minSize));
      }
      if (filters.maxSize !== undefined) {
        q = query(q, where('size', '<=', filters.maxSize));
      }
    }
  
    return collectionData(q.withConverter(propertyConverter), { idField: 'id' }) as Observable<Property[]>;
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
  
  async seedProperties(): Promise<void> {
    const propertyTypes = ['apartman', 'lakás', 'ház', 'üzlet'];
    const locations = ['Budapest', 'Debrecen', 'Szeged', 'Pécs', 'Győr'];
    const descriptions = [
      'Egy szép, modern ingatlan a város szívében.',
      'Kényelmes és tágas lakás jó közlekedéssel.',
      'Családi ház zöldövezeti környezetben.',
      'Üzlethelyiség frekventált helyen, nagy forgalommal.',
      'Újszerű, felújított ingatlan kiváló adottságokkal.'
    ];
    const owners = ['user123', 'user456', 'user789', 'user321'];
  
    function getRandom<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
    }
  
    function createRandomProperty(type: string, index: number): Property {
      return {
        id: '',
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} #${index + 1}`,
        description: getRandom(descriptions),
        location: getRandom(locations),
        ownerId: getRandom(owners),
        price: 30000000 + Math.floor(Math.random() * 20000000), // 30M - 50M között
        size: 40 + Math.floor(Math.random() * 60), // 40 - 100 nm között
        createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        imageUrl: `https://picsum.photos/400/200?random=${index + Math.floor(Math.random() * 1000)}`,
        type: type
      };
    }
  
    for (const type of propertyTypes) {
      for (let i = 0; i < 10; i++) {
        const property = createRandomProperty(type, i);
        const newDocRef = doc(this.propertiesCollection);
        property.id = newDocRef.id;
        await setDoc(newDocRef, property);
      }
    }
  }  

  async updateMissingImages(): Promise<void> {
    const snapshot = await getDocs(this.propertiesCollection);
    let i = 1;
  
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (!data.imageUrl) {
        const imageUrl = `https://picsum.photos/400/200?random=${i + Math.floor(Math.random() * 1000)}`;
        await updateDoc(docSnap.ref, { imageUrl });
        i++;
      }
    }
  
    console.log('✅ Minden property kapott képet, ha hiányzott.');
  }
}

