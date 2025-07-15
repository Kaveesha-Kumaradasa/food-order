// src/redux/actions/menuActions.ts
import type { RootState } from '../store';
import { setLoading, setItems, setCategories, setError, setActiveCategory } from '../slices/menuSlice';
import httpInterceptor from '@/services/http-interceptor';
import { MenuItem, Category } from '@/models/MenuItem';
import { environment } from '@/environments';

export const fetchMenuData = () => async (dispatch: any, getState: () => RootState) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const endpoint = '/webshop/main-menu/65/categories/webshop-brand/1/shop/2';
    console.log('Fetching menu from:', `${environment.pos.api_base_url}${endpoint}`);
    const response = await httpInterceptor.get(endpoint, {
      headers: { 'account_brand': environment.BRAND_ID },
    });

    console.log('Raw API Response:', JSON.stringify(response.data, null, 2)); // Log raw response

    const responseData = response.data?.data || {};
    const categories: Category[] = [];
    const menuItems: MenuItem[] = [];

    const FALLBACK_IMAGE = '../assets/images/Food1.png';

    Object.entries(responseData).forEach(([categoryName, items]) => {
      if (Array.isArray(items)) {
        categories.push({
          id: categoryName.toLowerCase().replace(/\s+/g, '-'),
          name: categoryName,
        });

        items.forEach((item: any) => {
          const image = item.image_url || (item.images?.find((img: any) => img.size === 'medium')?.path) || FALLBACK_IMAGE;
          const price = item.price ? String(item.price) : '0.00'; // Ensure price is string
          console.log(`Item: ${item.title}, Image: ${image}, Price: ${price}`);
          menuItems.push({
            id: item.id.toString(),
            name: item.title,
            description: item.description || 'No description available',
            price,
            image,
            category: categoryName,
            allergies: item.allergies || [],
            availability: item.availability === 1,
          });
        });
      }
    });

    if (menuItems.length === 0) {
      console.warn('No menu items found, using mock data');
      menuItems.push(
        {
          id: '1',
          name: 'Rice and Curry',
          description: 'Traditional Sri Lankan meal with rice and curries',
          price: '6.00',
          image: FALLBACK_IMAGE,
          category: 'Sri Lankan',
          allergies: ['Celery'],
          availability: true,
        },
        {
          id: '2',
          name: 'Mixed Vegetables Fried Rice',
          description: 'Delicious fried rice with vegetables',
          price: '5.00',
          image: FALLBACK_IMAGE,
          category: 'Sri Lankan',
          allergies: ['Gluten'],
          availability: true,
        },
        {
          id: '3',
          name: 'Lump Rice',
          description: 'Traditional lump rice dish',
          price: '7.00',
          image: FALLBACK_IMAGE,
          category: 'Sri Lankan',
          availability: true,
        }
      );
    }
    if (categories.length === 0) {
      console.warn('No categories found, using mock categories');
      categories.push({ id: 'sri-lankan', name: 'Sri Lankan' });
    }

    dispatch(setItems(menuItems));
    dispatch(setCategories(categories));
    const state = getState();
    if (categories.length > 0 && !state.menu.activeCategory) {
      dispatch(setActiveCategory(categories[0].name));
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch menu data';
    console.error('Menu Fetch Error:', errorMessage, err.response?.status, err.response?.config?.url);
    dispatch(setError(errorMessage));
  } finally {
    dispatch(setLoading(false));
  }
};