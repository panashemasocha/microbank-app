
export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    ADMIN: '/admin',
    ADMIN_CLIENTS: '/admin/clients'
  } as const;
  
  export const USER_ROLES = {
    CLIENT: 'CLIENT',
    ADMIN: 'ADMIN'
  } as const;
  
  export const TRANSACTION_TYPES = {
    DEPOSIT: 'DEPOSIT',
    WITHDRAWAL: 'WITHDRAWAL'
  } as const;
  
  export const STORAGE_KEYS = {
    TOKEN: 'microbank_token',
    USER: 'microbank_user',
    REFRESH_TOKEN: 'microbank_refresh_token'
  } as const;
  
  export const VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    MIN_PASSWORD_LENGTH: 'Password must be at least 6 characters',
    PASSWORDS_MUST_MATCH: 'Passwords must match',
    INVALID_AMOUNT: 'Please enter a valid amount',
    MINIMUM_AMOUNT: 'Minimum amount is $0.01'
  } as const;