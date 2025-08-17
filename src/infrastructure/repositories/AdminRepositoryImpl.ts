import { AdminRepository } from '@/domain/repositories/AdminRepository';
import { User } from '@/domain/entities/User';
import { apiClient, handleResponse } from '../http/client';
import { API_ENDPOINTS } from '@/shared/constants/apiConstants';

export class AdminRepositoryImpl implements AdminRepository {
  async getClients(): Promise<User[]> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.LIST);
    const items = await handleResponse<Array<{ id: string; email: string; blacklisted?: boolean }>>(response);
    // Map backend shape into our User model expected by UI
    const users: User[] = items.map((it) => ({
      id: it.id,
      email: it.email,
      username: it.email ? it.email.split('@')[0] : '',
      role: 'CLIENT',
      isBlacklisted: Boolean(it.blacklisted),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return users;
  }

  async blacklistClient(clientId: string): Promise<void> {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.BLACKLIST(clientId));
    return handleResponse<void>(response);
  }

  async unblacklistClient(clientId: string): Promise<void> {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.UNBLACKLIST(clientId));
    return handleResponse<void>(response);
  }
}
