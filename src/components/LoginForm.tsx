import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api.service';
import UserService from '../services/user.service';
import { ThemeSwitcher } from './ThemeSwitcher';

export const LoginForm: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await ApiService.login(login, password);
            UserService.setCurrentUser(user);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas logowania');
        } finally {
            setIsLoading(false);
        }
    };

    const demoUsers = [
        { login: 'admin', password: 'admin123', role: 'Administrator', name: 'Jan Kowalski' },
        { login: 'anna.dev', password: 'dev123', role: 'Developer', name: 'Anna Nowak' },
        { login: 'piotr.dev', password: 'dev123', role: 'Developer', name: 'Piotr Wiśniewski' },
        { login: 'kasia.ops', password: 'ops123', role: 'DevOps', name: 'Katarzyna Wójcik' },
        { login: 'tomek.ops', password: 'ops123', role: 'DevOps', name: 'Tomasz Lewandowski' },
    ];

    const handleDemoLogin = (demoLogin: string, demoPassword: string) => {
        setLogin(demoLogin);
        setPassword(demoPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                        <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
                        ManagMe
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Zaloguj się do swojego konta
                    </p>
                </div>

                {/* Theme switcher */}
                <div className="flex justify-center">
                    <ThemeSwitcher />
                </div>

                {/* Login form */}
                <div className="card">
                    <div className="card-body">
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-fade-in">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-group">
                                <label htmlFor="login" className="form-label">
                                    Login
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="login"
                                        value={login}
                                        onChange={(e) => setLogin(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        placeholder="np. admin"
                                        className="form-input pl-10"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Hasło
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        placeholder="np. admin123"
                                        className="form-input pl-10 pr-10"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="btn-primary w-full justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logowanie...
                                    </>
                                ) : (
                                    'Zaloguj się'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* Demo users */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Użytkownicy testowi
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Kliknij, aby szybko zalogować się
                        </p>
                    </div>
                    <div className="card-body">
                        <div className="grid gap-3">
                            {demoUsers.map((user, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDemoLogin(user.login, user.password)}
                                    disabled={isLoading}
                                    className="p-3 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {user.role}
                                            </div>
                                        </div>
                                        <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                                            {user.login}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};