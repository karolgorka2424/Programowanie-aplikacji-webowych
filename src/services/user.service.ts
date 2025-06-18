import { User, UserRole } from "../models/User";

class UserService {
    private static readonly CURRENT_USER_KEY = "currentUser";
    private static readonly USERS_KEY = "users";
    
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

    static initializeUsers(): void {
        const existingUsers = localStorage.getItem(this.USERS_KEY);
        if (!existingUsers) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify(this.mockUsers));
        }
    }

    static getAllUsers(): User[] {
        this.initializeUsers();
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
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

    static getCurrentUser(): User {
        const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
        if (storedUser) {
            return JSON.parse(storedUser);
        }
        
        const admin = this.mockUsers[0];
        this.setCurrentUser(admin);
        return admin;
    }

    static setCurrentUser(user: User): void {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    static logout(): void {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }
}

export default UserService;