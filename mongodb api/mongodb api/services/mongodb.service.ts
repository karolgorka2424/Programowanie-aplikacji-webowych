class MongoDBService {
    private static readonly BASE_URL = 'http://localhost:3001/api';
    
    static async request(url: string, options: RequestInit = {}): Promise<any> {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        try {
            const response = await fetch(`${this.BASE_URL}${url}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Błąd serwera MongoDB');
            }

            return response.json();
        } catch (error) {
            console.error('MongoDB Service Error:', error);
            throw error;
        }
    }

    // Projects
    static async getProjects() {
        return this.request('/projects');
    }

    static async getProject(id: string) {
        return this.request(`/projects/${id}`);
    }

    static async createProject(project: { name: string; description: string }) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(project)
        });
    }

    static async updateProject(id: string, project: { name: string; description: string }) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(project)
        });
    }

    static async deleteProject(id: string) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE'
        });
    }

    static async searchProjects(term: string) {
        return this.request(`/projects/search/${encodeURIComponent(term)}`);
    }

    // Stories
    static async getStories() {
        return this.request('/stories');
    }

    static async getStory(id: string) {
        return this.request(`/stories/${id}`);
    }

    static async getStoriesByProject(projectId: string) {
        return this.request(`/projects/${projectId}/stories`);
    }

    static async createStory(story: any) {
        return this.request('/stories', {
            method: 'POST',
            body: JSON.stringify(story)
        });
    }

    static async updateStory(id: string, story: any) {
        return this.request(`/stories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(story)
        });
    }

    static async deleteStory(id: string) {
        return this.request(`/stories/${id}`, {
            method: 'DELETE'
        });
    }

    // Tasks
    static async getTasks() {
        return this.request('/tasks');
    }

    static async getTask(id: string) {
        return this.request(`/tasks/${id}`);
    }

    static async getTasksByProject(projectId: string) {
        return this.request(`/projects/${projectId}/tasks`);
    }

    static async getTasksByStory(storyId: string) {
        return this.request(`/stories/${storyId}/tasks`);
    }

    static async createTask(task: any) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(task)
        });
    }

    static async updateTask(id: string, task: any) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(task)
        });
    }

    static async deleteTask(id: string) {
        return this.request(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }

    static async assignUserToTask(taskId: string, userId: string) {
        return this.request(`/tasks/${taskId}/assign`, {
            method: 'PATCH',
            body: JSON.stringify({ userId })
        });
    }

    static async completeTask(taskId: string) {
        return this.request(`/tasks/${taskId}/complete`, {
            method: 'PATCH'
        });
    }

    // Users
    static async getUsers() {
        return this.request('/users');
    }

    static async getAssignableUsers() {
        return this.request('/users/assignable');
    }
}

export default MongoDBService;