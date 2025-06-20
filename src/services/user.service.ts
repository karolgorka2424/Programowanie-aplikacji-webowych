import { User, UserRole } from "../models/User";
import MongoDBService from "./mongodb.service";
import ApiService from "./api.service";

class UserService {
    private static readonly CURRENT_USER_KEY = "currentUser";
    private static readonly USERS_KEY = "users";
    private static cachedUsers: User[] | null = null;
    private static useLocalStorage = false;
    
    // Mock użytkowników (fallback)
    private static mockUsers: User[] = [
        {
            id: "user-1",
            firstName: "Jan",
            lastName: "Kowalski",
            role: "admin"
        },
        {
            id: "user-2",
            firstName: "Anna",
            lastName: "Nowak",
            role: "developer"
        },
        {
            id: "user-3",
            firstName: "Piotr",
            lastName: "Wiśniewski",
            role: "developer"
        },
        {
            id: "user-4",
            firstName: "Katarzyna",
            lastName: "Wójcik",
            role: "devops"
        },
        {
            id: "user-5",
            firstName: "Tomasz",
            lastName: "Lewandowski",
            role: "devops"
        }
    ];

    static async initializeUsers(): Promise<void> {
        try {
            if (this.useLocalStorage) {
                return this.initializeUsersFromLocalStorage();
            }
            
            // Spróbuj pobrać użytkowników z MongoDB
            const users = await MongoDBService.getUsers();
            this.cachedUsers = users.map(this.transformMongoUser);
            localStorage.setItem(this.USERS_KEY, JSON.stringify(this.cachedUsers));
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.initializeUsersFromLocalStorage();
        }
    }

    static async getAllUsers(): Promise<User[]> {
        try {
            if (this.useLocalStorage) {
                return this.getAllUsersFromLocalStorage();
            }
            
            if (this.cachedUsers) {
                return this.cachedUsers;
            }
            
            const users = await MongoDBService.getUsers();
            this.cachedUsers = users.map(this.transformMongoUser);
            return this.cachedUsers;
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.getAllUsersFromLocalStorage();
        }
    }

    static async getUserById(id: string): Promise<User | undefined> {
        try {
            if (this.useLocalStorage) {
                return this.getUserFromLocalStorage(id);
            }
            
            const users = await this.getAllUsers();
            return users.find(user => user.id === id);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.getUserFromLocalStorage(id);
        }
    }

    static async getUsersByRole(role: UserRole): Promise<User[]> {
        try {
            if (this.useLocalStorage) {
                return this.getUsersByRoleFromLocalStorage(role);
            }
            
            const users = await this.getAllUsers();
            return users.filter(user => user.role === role);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.getUsersByRoleFromLocalStorage(role);
        }
    }

    static async getAssignableUsers(): Promise<User[]> {
        try {
            if (this.useLocalStorage) {
                return this.getAssignableUsersFromLocalStorage();
            }
            
            const users = await MongoDBService.getAssignableUsers();
            return users.map(this.transformMongoUser);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.getAssignableUsersFromLocalStorage();
        }
    }

    static async getCurrentUser(): Promise<User | null> {
        try {
            // Spróbuj pobrać z API (autentykacja)
            if (ApiService.isAuthenticated()) {
                const user = await ApiService.getCurrentUser();
                this.setCurrentUser(user);
                return user;
            }
        } catch (error) {
            console.warn('Nie można pobrać aktualnego użytkownika z API');
        }
        
        // Fallback na localStorage
        const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
        if (storedUser) {
            return JSON.parse(storedUser);
        }
        
        return null;
    }

    static setCurrentUser(user: User): void {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    static async logout(): Promise<void> {
        try {
            await ApiService.logout();
        } catch (error) {
            console.error('Błąd podczas wylogowywania:', error);
        } finally {
            localStorage.removeItem(this.CURRENT_USER_KEY);
            this.cachedUsers = null;
        }
    }

    // Metody pomocnicze
    private static transformMongoUser(mongoUser: any): User {
        return {
            id: mongoUser._id.toString(),
            firstName: mongoUser.firstName,
            lastName: mongoUser.lastName,
            role: mongoUser.role
        };
    }

    // Metody fallback dla localStorage
    private static initializeUsersFromLocalStorage(): void {
        try {
            // Spróbuj pobrać użytkowników z API
            ApiService.getAllUsers().then(users => {
                this.cachedUsers = users;
                localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            }).catch(() => {
                // Jeśli API nie działa, użyj mock danych
                console.warn('Nie można pobrać użytkowników z API, używam danych mock');
                const existingUsers = localStorage.getItem(this.USERS_KEY);
                if (!existingUsers) {
                    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.mockUsers));
                }
            });
        } catch (error) {
            console.warn('Błąd podczas inicjalizacji użytkowników');
        }
    }

    private static getAllUsersFromLocalStorage(): User[] {
        // ✅ FIX: Obsługa null z cachedUsers
        if (this.cachedUsers !== null) {
            return this.cachedUsers;
        }
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : this.mockUsers;
    }

    private static getUserFromLocalStorage(id: string): User | undefined {
        const users = this.getAllUsersFromLocalStorage();
        return users.find(user => user.id === id);
    }

    private static getUsersByRoleFromLocalStorage(role: UserRole): User[] {
        const users = this.getAllUsersFromLocalStorage();
        return users.filter(user => user.role === role);
    }

    private static getAssignableUsersFromLocalStorage(): User[] {
        const users = this.getAllUsersFromLocalStorage();
        return users.filter(user => 
            user.role === 'developer' || user.role === 'devops'
        );
    }
}

export default UserService;