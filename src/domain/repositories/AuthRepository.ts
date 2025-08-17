import { User } from "../entities/User";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData{
    fullName: string;
    email: string;
    password: string;
}

export interface AuthResponse{
    token: string;
    refreshToken: string;
    user: User;
}

export interface AuthRepository{
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    register(data: RegisterData): Promise<AuthResponse>;
    getProfile(): Promise<User>;
    logout(): Promise<void>;
}
