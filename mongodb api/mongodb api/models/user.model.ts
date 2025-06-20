export interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'developer' | 'devops';
    createdAt: Date;
    updatedAt: Date;
}

export type UserId = string;
export type UserWithoutId = Omit<User, '_id'>;