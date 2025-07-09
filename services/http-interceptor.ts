import axios from 'axios';
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

export default httpInterceptor;