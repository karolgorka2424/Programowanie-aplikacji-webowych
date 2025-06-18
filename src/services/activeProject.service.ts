class ActiveProjectService {
    private static readonly ACTIVE_PROJECT_KEY = "activeProjectId";

    static setActiveProject(projectId: string): void {
        localStorage.setItem(this.ACTIVE_PROJECT_KEY, projectId);
    }

    static getActiveProjectId(): string | null {
        return localStorage.getItem(this.ACTIVE_PROJECT_KEY);
    }

    static clearActiveProject(): void {
        localStorage.removeItem(this.ACTIVE_PROJECT_KEY);
    }

    static hasActiveProject(): boolean {
        return this.getActiveProjectId() !== null;
    }
}

export default ActiveProjectService;