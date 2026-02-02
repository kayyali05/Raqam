export type ListingCategory = "car_plate" | "mobile_number";

export interface Listing {
  id: string;
  category: ListingCategory;
  number: string;
  price: number;
  description: string;
  location: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
}

export interface CreateListingInput {
  category: ListingCategory;
  number: string;
  price: number;
  description: string;
  location: string;
}
