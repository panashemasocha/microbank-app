import axios from 'axios';
import { StorageService } from '@/shared/services/storageService';

const BACKEND_URL = (import.meta as ImportMeta).env?.VITE_API_BASE_URL ?? 'http://localhost:8080/';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.url?.includes('/login') && !config.url?.includes('/register')) {
      const token = StorageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      StorageService.clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const handleResponse = <T>(response: { status: number; data: T }): T => {
  if (response && response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error('Invalid response structure or status code.');
  }
};

const handleError = (error: unknown) => {
  return Promise.reject(error);
};

export { axiosInstance as apiClient, handleError, handleResponse };
