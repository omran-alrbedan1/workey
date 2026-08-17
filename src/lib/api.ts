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

const backendErrorMessages: Record<string, string> = {
  COMPANY_PENDING: 'Your company is pending approval. Please wait for administrator approval.',
  COMPANY_REJECTED: 'Your company has been rejected. Please contact support for more information.',
  COMPANY_SUSPENDED: 'Your company has been suspended. Please contact support.',
  COMPANY_MEMBER_SUSPENDED: 'Your company membership is suspended. Please contact your company owner or support.',
  COMPANY_MEMBER_REMOVED: 'Your company membership was removed. Please sign in with an authorized account.',
  VIEW_APPLICATIONS_DENIED: 'You do not have permission to view applications.',
  MANAGE_APPLICATIONS_DENIED: 'You do not have permission to manage applications.',
  EMPLOYER_SELF_REGISTRATION_DISABLED: 'Employer self-registration is disabled. Please use a company invitation link.',
  APPLICATION_INTERNAL_NOTE_VERSION_CONFLICT: 'This note was modified by someone else. Please refresh and try again.',
  APPLICATION_INTERNAL_NOTE_EDIT_WINDOW_EXPIRED: 'The edit window for this note has expired.',
  APPLICATION_INTERNAL_NOTES_READ_ONLY: 'Cannot add notes to final-state applications.',
  APPLICATION_INFORMATION_REQUEST_ALREADY_OPEN: 'A pending information request already exists for this application.',
  APPLICATION_INFORMATION_REQUEST_NOT_PENDING: 'This information request is no longer pending.',
  INVALID_STATUS_TRANSITION: 'This status transition is not allowed.',
  TERMINAL_STATE: 'This application is already in a final state.',
  CV_SUMMARY_SOURCE_UNAVAILABLE: 'No usable CV source is available for this application.',
  CV_SUMMARY_NOT_CONFIGURED: 'CV summary generation is not configured on the backend.',
  CV_SUMMARY_TIMEOUT: 'CV summary generation timed out. Please try again.',
};

function preferredLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('i18nextLng') || navigator.language || 'en';
  const normalized = stored.toLowerCase().split('-')[0];
  return normalized === 'ar' ? 'ar' : 'en';
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

    // Add Accept-Language header for localization
    if (typeof window !== 'undefined') {
      config.headers['Accept-Language'] = preferredLanguage();
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
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      localStorage.removeItem(STORAGE_KEYS.user);
      if (!window.location.pathname.includes('/login')) {
        window.location.href = ROUTES.auth.login;
      }
    }

    // Initialize apiError with default values
    const apiError: ApiError = {
      message:
        backendErrorMessages[error.response?.data?.code] ||
        error.response?.data?.message ||
        error.message ||
        'An error occurred',
      statusCode: error.response?.status,
      code: error.response?.data?.code,
      errors: error.response?.data?.errors,
    };

    // Handle 403 Forbidden - permission denied
    if (error.response?.status === 403) {
      const code = error.response?.data?.code;
      if (!backendErrorMessages[code]) {
        apiError.message = error.response?.data?.message || 'You do not have permission to perform this action.';
      }
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      apiError.message = error.response?.data?.message || 'The requested resource was not found.';
    }

    // Handle 409 Conflict - resource conflict
    if (error.response?.status === 409) {
      const code = error.response?.data?.code;
      if (!backendErrorMessages[code]) {
        apiError.message = error.response?.data?.message || 'A conflict occurred. Please refresh and try again.';
      }
    }

    // Handle 422 Unprocessable Entity - validation errors
    if (error.response?.status === 422) {
      apiError.message = error.response?.data?.message || 'Invalid input. Please check your data and try again.';
      if (error.response?.data?.errors) {
        apiError.errors = error.response.data.errors;
      }
    }
    
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
