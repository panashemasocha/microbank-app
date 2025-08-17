import { User } from '@/domain/entities/User';
import { STORAGE_KEYS } from '../constants/appConstants';

export class StorageService {
  static setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  static setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userString = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userString) return null;
    // Guard against invalid values such as the literal string 'undefined' or malformed JSON
    if (userString === 'undefined' || userString === 'null') {
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
    try {
      const parsed = JSON.parse(userString);
      return parsed as User;
    } catch {
      // Corrupt entry; clear and return null to avoid app crash
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}