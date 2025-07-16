// src/redux/slices/menuSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import { MenuItem, Category } from '@/models/MenuItem';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  category: string;
  allergies?: string[];
  availability: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface MenuState {
  items: MenuItem[];
  categories: Category[];
  activeCategory: string;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  activeCategory: '',
  loading: false,
  error: null,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<MenuItem[]>) {
      state.items = action.payload;
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    setActiveCategory(state, action: PayloadAction<string>) {
      state.activeCategory = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setItems, setCategories, setActiveCategory, setLoading, setError } = menuSlice.actions;
export default menuSlice.reducer;