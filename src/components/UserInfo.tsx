import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../models/User';
import UserService from '../services/user.service.ts';

export const UserInfo = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const currentUser = await UserService.getCurrentUser();
        setUser(currentUser);
    };

    const handleLogout = async () => {
        await UserService.logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="user-info">
            <span>Zalogowany jako: {user.firstName} {user.lastName} ({user.role})</span>
            <button className="logout-btn" onClick={handleLogout}>
                Wyloguj
            </button>
        </div>
    );
};