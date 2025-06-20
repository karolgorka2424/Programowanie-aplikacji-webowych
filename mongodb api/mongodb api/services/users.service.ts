import { UserWithoutId, User, UserId } from "../models/user.model";
import { dbService } from "./db.service";

class UsersService {
    private collectionName = 'users';

    getUsers() {
        return dbService.find<User>({}, this.collectionName);
    }

    getUser(id: UserId) {
        return dbService.findOne<User>(id, this.collectionName);
    }

    async createUser(user: UserWithoutId) {
        const userWithTimestamps = {
            ...user,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return dbService.create(userWithTimestamps, this.collectionName);
    }

    updateUser(id: string, user: Partial<UserWithoutId>) {
        const userWithTimestamp = {
            ...user,
            updatedAt: new Date()
        };
        return dbService.patch(id, userWithTimestamp, this.collectionName);
    }

    replaceUser(id: string, user: UserWithoutId) {
        const userWithTimestamps = {
            ...user,
            updatedAt: new Date()
        };
        return dbService.replace(id, userWithTimestamps, this.collectionName);
    }

    deleteUser(id: UserId) {
        return dbService.delete(id, this.collectionName);
    }

    // Metody specyficzne dla User
    async getUsersByRole(role: User['role']) {
        const query = { role };
        return dbService.find<User>(query, this.collectionName);
    }

    async getAssignableUsers() {
        const query = { 
            role: { $in: ['developer', 'devops'] } 
        };
        return dbService.find<User>(query, this.collectionName);
    }

    async getUserByEmail(email: string) {
        const query = { email };
        const users = await dbService.find<User>(query, this.collectionName);
        return users.length > 0 ? users[0] : null;
    }
}

export const usersService = new UsersService();