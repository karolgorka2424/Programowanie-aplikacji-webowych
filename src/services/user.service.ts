import { User } from "../models/User";

class UserService {
    private static readonly CURRENT_USER_KEY = "currentUser";
    private static mockUser: User = {
        id: "user-1",
        firstName: "Jan",
        lastName: "Kowalski"
    };

    static getCurrentUser(): User {
        const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
        if (storedUser) {
            return JSON.parse(storedUser);
        }
        // Jeśli nie ma zapisanego użytkownika, zapisz i zwróć mock
        this.setCurrentUser(this.mockUser);
        return this.mockUser;
    }

    static setCurrentUser(user: User): void {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    static logout(): void {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }
}

export default UserService;