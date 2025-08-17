import { User } from "../entities/User";

export interface AdminRepository{
    getClients(): Promise<User[]>;
    blacklistClient(clientId: string): Promise<void>;
    unblacklistClient(clientId: string): Promise<void>;
}
    