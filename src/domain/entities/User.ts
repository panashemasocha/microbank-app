export interface User {
    id: string;
    username: string;
    email: string;
    role: 'CLIENT' | 'ADMIN';
    isBlacklisted: boolean;
    createdAt: string;
    updatedAt: string;
}

