import { useEffect, useState } from 'react';
import { User } from '../models/User';
import UserService from '../services/user.service.ts';

export const UserInfo = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const currentUser = UserService.getCurrentUser();
        setUser(currentUser);
    }, []);

    if (!user) return null;

    return (
        <div className="user-info">
            <span>Zalogowany jako: {user.firstName} {user.lastName} ({user.role})</span>
        </div>
    );
};