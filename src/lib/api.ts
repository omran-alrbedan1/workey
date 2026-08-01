import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ENDPOINTS, ROUTES, STORAGE_KEYS } from '@/config';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
  errors?: Record<string, string[] | string | number | boolean | null>;
}

// Create axios instance with default config
const API: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - token refresh
    if (API_CONFIG.enableTokenRefresh && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.refreshToken) : null;
        
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.refresh}`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          localStorage.setItem(STORAGE_KEYS.accessToken, access_token);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        // Redirect to login if refresh fails
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.accessToken);
          localStorage.removeItem(STORAGE_KEYS.refreshToken);
          window.location.href = ROUTES.auth.login;
        }
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response?.status === 401 && typeof window !== 'undefined' && !API_CONFIG.enableTokenRefresh) {
      localStorage.removeItem(STORAGE_KEYS.accessToken);
    }

    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status,
      code: error.response?.data?.code,
      errors: error.response?.data?.errors,
    };
    
    return Promise.reject(apiError);
  }
);

// Generic wrapper methods with types
const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => 
    API.get(url, config).then((response) => response.data),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    API.post(url, data, config).then((response) => response.data),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    API.put(url, data, config).then((response) => response.data),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    API.patch(url, data, config).then((response) => response.data),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => 
    API.delete(url, config).then((response) => response.data),
};


export default API;

export { API as rawApi,  api };
