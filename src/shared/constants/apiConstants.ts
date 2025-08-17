export const API_ENDPOINTS = {
    // Client Service Endpoints
    CLIENT: {
      REGISTER: '/api/auth/register',
      LOGIN: '/auth/login',
      PROFILE: '/api/me',
    },
    // Admin Service Endpoints
    ADMIN: {
      LIST: '/api/admin/users',
      BLACKLIST: (clientId: string) => `/api/admin/blacklist/${clientId}`,
      UNBLACKLIST: (clientId: string) => `/api/admin/unblacklist/${clientId}`,
    },
    
    // Banking Service Endpoints
    BANKING: {
      BALANCE: '/api/accounts/balance',
      DEPOSIT: '/api/accounts/deposit',
      WITHDRAW: '/api/accounts/withdraw',
      TRANSACTIONS: '/api/accounts/transactions'
    }
  } as const;
  
  export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  } as const;