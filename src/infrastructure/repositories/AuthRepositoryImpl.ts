import { AuthRepository, LoginCredentials, RegisterData, AuthResponse } from '@/domain/repositories/AuthRepository';
import { User } from '@/domain/entities/User';
import { apiClient, handleResponse } from '../http/client';
import { API_ENDPOINTS } from '@/shared/constants/apiConstants';

type BackendAuthResponse = {
  token: string;
  refreshToken?: string;
  clientId?: string;
  id?: string;
  email?: string;
  fullName?: string;
  roles?: string[];
  blacklisted?: boolean;
};

type BackendProfileResponse = {
  clientId?: string;
  id?: string;
  email?: string;
  fullName?: string;
  roles?: string[];
  blacklisted?: boolean;
};

export class AuthRepositoryImpl implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.CLIENT.LOGIN, credentials);
    const data = await handleResponse<BackendAuthResponse>(response);
    const user: User = {
      id: data.clientId ?? data.id ?? '',
      username: data.fullName ?? (data.email ? String(data.email).split('@')[0] : ''),
      email: data.email ?? '',
      role: Array.isArray(data.roles) && data.roles.includes('ADMIN') ? 'ADMIN' : 'CLIENT',
      isBlacklisted: Boolean(data.blacklisted),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const mapped: AuthResponse = {
      token: data.token,
      refreshToken: data.refreshToken ?? '',
      user,
    };
    return mapped;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.CLIENT.REGISTER, data);
    const res = await handleResponse<BackendAuthResponse>(response);
    const user: User = {
      id: res.clientId ?? res.id ?? '',
      username: res.fullName ?? (res.email ? String(res.email).split('@')[0] : ''),
      email: res.email ?? '',
      role: Array.isArray(res.roles) && res.roles.includes('ADMIN') ? 'ADMIN' : 'CLIENT',
      isBlacklisted: Boolean(res.blacklisted),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const mapped: AuthResponse = {
      token: res.token,
      refreshToken: res.refreshToken ?? '',
      user,
    };
    return mapped;
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.CLIENT.PROFILE);
    const data = await handleResponse<BackendProfileResponse>(response);
    const user: User = {
      id: data.clientId ?? data.id ?? '',
      username: data.fullName ?? (data.email ? String(data.email).split('@')[0] : ''),
      email: data.email ?? '',
      role: Array.isArray(data.roles) && data.roles.includes('ADMIN') ? 'ADMIN' : 'CLIENT',
      isBlacklisted: Boolean(data.blacklisted),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return user;
  }

  async logout(): Promise<void> {
    return Promise.resolve();
  }
}