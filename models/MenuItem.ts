// src/models/MenuItem.ts
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  category: string;
  allergies?: string[];
  availability: boolean;
}

export interface Category {
  id: string;
  name: string;
}