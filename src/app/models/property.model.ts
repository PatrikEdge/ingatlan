export interface Property {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    type: string;
    size: number;
    createdAt: Date;  // vagy Timestamp
    ownerId: string;
    imageUrl?: string;
  }
  