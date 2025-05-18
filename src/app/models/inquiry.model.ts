export interface Inquiry {
    id: string;
    propertyId: string;   // melyik ingatlanhoz tartozik az érdeklődés
    userId: string;       // ki az érdeklődő
    message: string;      // az érdeklődés tartalma
    sentAt: Date;         // mikor küldte
    isRead?: boolean;     // olvasott-e már
  }
  