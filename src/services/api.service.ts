class ApiService {
    private static readonly BASE_URL = 'http://localhost:3000/api';
    private static token: string | null = null;
    private static refreshToken: string | null = null;

    static init() {
        // Odczytaj tokeny z localStorage przy starcie
        this.token = localStorage.getItem('token');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    static setTokens(token: string, refreshToken: string) {
        this.token = token;
        this.refreshToken = refreshToken;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    }

    static clearTokens() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    static async request(url: string, options: RequestInit = {}): Promise<any> {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
            ...options.headers
        };

        const response = await fetch(`${this.BASE_URL}${url}`, {
            ...options,
            headers
        });

        if (response.status === 401 && this.refreshToken) {
            // Spróbuj odświeżyć token
            const refreshed = await this.refreshAccessToken();
            if (refreshed) {
                // Ponów żądanie z nowym tokenem
                return this.request(url, options);
            }
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Błąd serwera');
        }

        return response.json();
    }

    static async refreshAccessToken() {
        try {
            const response = await fetch(`${this.BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: this.refreshToken })
            });

            if (!response.ok) {
                throw new Error('Nie udało się odświeżyć tokenu');
            }

            const data = await response.json();
            this.token = data.token;
            localStorage.setItem('token', data.token);
            return true;
        } catch (error) {
            this.clearTokens();
            window.location.href = '/login';
            return false;
        }
    }

    // Metody autentykacji
    static async login(login: string, password: string) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ login, password })
        });

        this.setTokens(data.token, data.refreshToken);
        return data.user;
    }

    static async logout() {
        try {
            await this.request('/auth/logout', {
                method: 'POST',
                body: JSON.stringify({ refreshToken: this.refreshToken })
            });
        } finally {
            this.clearTokens();
        }
    }

    static async getCurrentUser() {
        return this.request('/auth/me');
    }

    static async getAllUsers() {
        return this.request('/users');
    }

    static isAuthenticated() {
        return !!this.token;
    }
}

// Inicjalizuj serwis
ApiService.init();

export default ApiService;