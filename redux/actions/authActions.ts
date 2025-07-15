import { AppDispatch } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '@/environments';
import httpInterceptor from '@/services/http-interceptor';

export const loginUser =
  (credentials: { email: string; password: string }, callback: (success: boolean, errorStatus: number, errorMessage: string) => void) =>
  async (dispatch: AppDispatch) => {
    console.log('Login attempt with:', credentials);
    try {
      await AsyncStorage.setItem('x-tenant-code', environment.x_tenant_code);

      const response = await httpInterceptor.post(
        '/webshop_customer/login',
        {
          username: credentials.email,
          password: credentials.password,
          grant_type: environment.GRANT_TYPE,
          client_id: environment.CLIENT_ID,
          client_secret: environment.CLIENT_SECRET,
          scope: `account_brand:${environment.BRAND_ID}`,
          account_brand: environment.BRAND_ID,
        },
        {
          baseURL: environment.user.api_base_url,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-tenant-code': environment.x_tenant_code,
          },
        }
      );

      console.log('Login response:', response.data);
      if (response.data && response.data.accessToken) {
        const userData = {
          access_token: response.data.accessToken,
          ...response.data,
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'auth/loginUser', payload: userData });
        callback(true, 0, '');
        // Navigate to home tab after successful login
        // This should be handled in the UI callback
      } else {
        callback(false, 0, 'No access token received. Response: ' + JSON.stringify(response.data));
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message, error.response?.status);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      const errorStatus = error.response?.status || 0;
      callback(false, errorStatus, errorMessage);
    }
  };

export const registerUser =
  (
    credentials: { email: string; password: string },
    callback: (success: boolean, errorStatus: number, errorMessage: string) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      await AsyncStorage.setItem('x-tenant-code', environment.x_tenant_code);

      const response = await httpInterceptor.post(
        '/webshop_customer/register',
        {
          username: credentials.email,
          email: credentials.email,
          password: credentials.password,
          first_name: 'User',
          last_name: 'Default',
          country_code: '+91',
          contact_number: `+91${Math.floor(1000000000 + Math.random() * 9000000000).toString()}`,
          account_brand: environment.BRAND_ID,
        },
        {
          baseURL: environment.user.api_base_url,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'x-tenant-code': environment.x_tenant_code,
          },
        }
      );

      console.log('Register Response:', response.data);

      if (response.data && response.data.data && response.data.data.accessToken) {
        const userData = {
          access_token: response.data.data.accessToken,
          ...response.data.data,
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'auth/registerUser', payload: userData });
        callback(true, 0, '');
      } else {
        callback(false, 0, 'Registration successful, but no access token received. Please log in.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      const errorStatus = error.response?.status || 0;
      callback(false, errorStatus, errorMessage);
    }
  };

/*export const getCurrentUser =
  (callback: (response: any, error?: string) => void) => async (dispatch: AppDispatch) => {
    try {
      const tenantCode = await AsyncStorage.getItem('x-tenant-code');
      const userString = await AsyncStorage.getItem('user');

      if (!userString || !tenantCode) {
        callback(false, 'Missing user or tenant code');
        return;
      }

      const userData = JSON.parse(userString);
      const accessToken = userData?.access_token;

      if (!accessToken) {
        callback(false, 'Missing access token');
        return;
      }

      const response = await httpInterceptor.get(
        '/webshop_customer/current',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'x-tenant-code': tenantCode,
          },
          baseURL: environment.user.api_base_url,
        }
      );

      dispatch({ type: 'auth/getCurrentUser', payload: response.data });
      callback(response);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user data';
      callback(false, errorMessage);
    }
  };*/

export const logoutUser =
  (callback?: () => void) => async (dispatch: AppDispatch) => {
    try {
      await AsyncStorage.multiRemove(['user', 'x-tenant-code']);
      dispatch({ type: 'auth/logoutSuccess' });
      if (callback) {
        callback();
      }
    } catch (error) {
      console.error('Error removing AsyncStorage items:', error);
    }
  };