import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api.service';
import UserService from '../services/user.service';

export const LoginForm: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>ManagMe</h1>
                <h2>Logowanie</h2>
                
                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label htmlFor="login">Login:</label>
                        <input
                            type="text"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="np. admin"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Hasło:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="np. admin123"
                        />
                    </div>
                    
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                </form>
                
                <div className="demo-users">
                    <h3>Użytkownicy testowi:</h3>
                    <ul>
                        <li><strong>admin</strong> / admin123 (Administrator)</li>
                        <li><strong>anna.dev</strong> / dev123 (Developer)</li>
                        <li><strong>piotr.dev</strong> / dev123 (Developer)</li>
                        <li><strong>kasia.ops</strong> / ops123 (DevOps)</li>
                        <li><strong>tomek.ops</strong> / ops123 (DevOps)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};