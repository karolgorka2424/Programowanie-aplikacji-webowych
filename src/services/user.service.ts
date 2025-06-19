import { User, UserRole } from "../models/User";
import ApiService from "./api.service";


class UserService {
    private static readonly CURRENT_USER_KEY = "currentUser";
    private static readonly USERS_KEY = "users";
    private static cachedUsers: User[] | null = null;
    
    // Mock użytkowników
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
            // Spróbuj pobrać użytkowników z API
            const users = await ApiService.getAllUsers();
            this.cachedUsers = users;
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        } catch (error) {
            // Jeśli API nie działa, użyj mock danych
            console.warn('Nie można pobrać użytkowników z API, używam danych mock');
            const existingUsers = localStorage.getItem(this.USERS_KEY);
            if (!existingUsers) {
                localStorage.setItem(this.USERS_KEY, JSON.stringify(this.mockUsers));
            }
        }
    }

    static getAllUsers(): User[] {
        if (this.cachedUsers) {
            return this.cachedUsers;
        }
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : this.mockUsers;
    }

    static getUserById(id: string): User | undefined {
        return this.getAllUsers().find(user => user.id === id);
    }

    static getUsersByRole(role: UserRole): User[] {
        return this.getAllUsers().filter(user => user.role === role);
    }

    static getAssignableUsers(): User[] {
        return this.getAllUsers().filter(user => 
            user.role === 'developer' || user.role === 'devops'
        );
    }

    static async getCurrentUser(): Promise<User | null> {
        try {
            // Spróbuj pobrać z API
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
}

export default UserService;