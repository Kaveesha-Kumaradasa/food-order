/*import axios from 'axios';
import { environment } from '@/environments';
import AsyncStorage from '@react-native-async-storage/async-storage';

const httpInterceptor = axios.create({
  baseURL: environment.user.api_base_url,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpInterceptor.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('user').then((userString) =>
      userString ? JSON.parse(userString).access_token : null
    );
    const tenantCode = await AsyncStorage.getItem('x-tenant-code');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (tenantCode) {
      config.headers['x-tenant-code'] = tenantCode;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

httpInterceptor.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default httpInterceptor;*/




// src/services/http-interceptor.ts
import axios from 'axios';
import { environment } from '@/environments';
import AsyncStorage from '@react-native-async-storage/async-storage';

const httpInterceptor = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

httpInterceptor.interceptors.request.use(
  async (config) => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const token = userString ? JSON.parse(userString).access_token : null;
      const tenantCode = await AsyncStorage.getItem('x-tenant-code') || environment.x_tenant_code;

      config.baseURL = config.url?.includes('/webshop/') 
        ? environment.pos.api_base_url 
        : environment.user.api_base_url;

      if (token && config.url !== '/webshop_customer/login') {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['x-tenant-code'] = tenantCode;
      if (config.url?.includes('/webshop/')) {
        config.headers['account_brand'] = environment.BRAND_ID;
      }

      console.log('Request Config:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        baseURL: config.baseURL,
        data: config.data,
      });
      return config;
    } catch (error) {
      console.error('Interceptor Request Error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Interceptor Request Error:', error);
    return Promise.reject(error);
  }
);

httpInterceptor.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });
    if (error.response?.status === 404) {
      console.warn('Endpoint not found. Verify the URL and server configuration.');
    }
    if (error.message.includes('Network Error')) {
      console.warn('Possible CORS issue or server unreachable. Check server CORS configuration.');
    }
    if (error.response?.status === 401) {
      console.warn('Unauthorized access, consider logging out or refreshing token');
    }
    return Promise.reject(error);
  }
);

export default httpInterceptor;