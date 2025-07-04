import { useState, useEffect } from 'react';
import ApiService from '../services/api.service';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export const UserInfo = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await ApiService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (ApiService.isAuthenticated()) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await ApiService.logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Error logging out:', error);
            // Force logout even if API call fails
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }
    };

    const getInitials = (username?: string) => {
        if (!username) return '';
        return username
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };


    const getRoleDisplayName = (role: string) => {
        const roleMap: { [key: string]: string } = {
            'admin': 'Administrator',
            'manager': 'Menedżer',
            'developer': 'Deweloper',
            'designer': 'Designer',
            'tester': 'Tester',
            'user': 'Użytkownik'
        };
        return roleMap[role] || role;
    };

    const getRoleColor = (role: string) => {
        const colorMap: { [key: string]: string } = {
            'admin': 'from-red-500 to-pink-600',
            'manager': 'from-blue-500 to-indigo-600',
            'developer': 'from-green-500 to-teal-600',
            'designer': 'from-purple-500 to-pink-600',
            'tester': 'from-orange-500 to-yellow-600',
            'user': 'from-gray-500 to-gray-600'
        };
        return colorMap[role] || 'from-gray-500 to-gray-600';
    };

    if (isLoading) {
        return (
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="hidden sm:block space-y-1">
                    <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="user-info relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {/* Avatar */}
                <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor(user.role)} rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-sm`}>
                    <span className="text-white text-sm font-medium">
                        {getInitials(user.username)}
                    </span>
                </div>

                {/* User details */}
                <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getRoleDisplayName(user.role)}
                    </div>
                </div>

                {/* Dropdown arrow */}
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
                <>
                    <div className="dropdown-menu">
                        {/* User info section */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(user.role)} rounded-full flex items-center justify-center`}>
                                    <span className="text-white font-medium">
                                        {getInitials(user.username)}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {user.username}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {user.email}
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                        {getRoleDisplayName(user.role)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-2">
                            <button
                                onClick={() => setIsDropdownOpen(false)}
                                className="dropdown-item"
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profil
                            </button>
                            <button
                                onClick={() => setIsDropdownOpen(false)}
                                className="dropdown-item"
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Ustawienia
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Wyloguj się
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Click outside to close */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                ></div>
            )}
        </div>
    );
};