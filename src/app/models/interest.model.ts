export interface Interest {
    id?: string;
    userId: string;
    propertyId: string;
    propertyTitle: string;  // <-- új mező
    message?: string;
    timestamp: Date;
  }
  