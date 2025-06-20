import { Project } from "../models/Project";
import MongoDBService from "./mongodb.service";

class ProjectService {
    private static projects: Project[] = [];
    private static useLocalStorage = false; // Flaga dla trybu fallback

    static async getProjects(): Promise<Project[]> {
        try {
            const projects = await MongoDBService.getProjects();
            this.projects = projects.map(this.transformMongoProject);
            return this.projects;
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.getProjectsFromLocalStorage();
        }
    }

    static async getProjectById(id: string): Promise<Project | undefined> {
        try {
            if (this.useLocalStorage) {
                return this.getProjectFromLocalStorage(id);
            }
            const project = await MongoDBService.getProject(id);
            return project ? this.transformMongoProject(project) : undefined;
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.getProjectFromLocalStorage(id);
        }
    }

    static async saveProject(project: Project): Promise<void> {
        try {
            if (this.useLocalStorage) {
                return this.saveProjectToLocalStorage(project);
            }

            const projectData = {
                name: project.name,
                description: project.description
            };

            if (this.projects.find(p => p.id === project.id)) {
                // Aktualizacja
                await MongoDBService.updateProject(project.id, projectData);
            } else {
                // Tworzenie nowego
                const result = await MongoDBService.createProject(projectData);
                project.id = result.id;
            }
            
            // Aktualizuj cache
            const existingIndex = this.projects.findIndex(p => p.id === project.id);
            if (existingIndex >= 0) {
                this.projects[existingIndex] = project;
            } else {
                this.projects.push(project);
            }
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.saveProjectToLocalStorage(project);
        }
    }

    static async deleteProject(id: string): Promise<void> {
        try {
            if (this.useLocalStorage) {
                return this.deleteProjectFromLocalStorage(id);
            }
            await MongoDBService.deleteProject(id);
            this.projects = this.projects.filter(p => p.id !== id);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.deleteProjectFromLocalStorage(id);
        }
    }

    static async searchProjects(term: string): Promise<Project[]> {
        try {
            if (this.useLocalStorage) {
                return this.searchProjectsInLocalStorage(term);
            }
            const projects = await MongoDBService.searchProjects(term);
            return projects.map(this.transformMongoProject);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.searchProjectsInLocalStorage(term);
        }
    }

    // Metody pomocnicze
    private static transformMongoProject(mongoProject: any): Project {
        return {
            id: mongoProject._id.toString(),
            name: mongoProject.name,
            description: mongoProject.description
        };
    }

    // Metody fallback dla localStorage
    private static getProjectsFromLocalStorage(): Project[] {
        const projects = localStorage.getItem("projects");
        return projects ? JSON.parse(projects) : [];
    }

    private static getProjectFromLocalStorage(id: string): Project | undefined {
        const projects = this.getProjectsFromLocalStorage();
        return projects.find(p => p.id === id);
    }

    private static saveProjectToLocalStorage(project: Project): void {
        const projects = this.getProjectsFromLocalStorage();
        const existingIndex = projects.findIndex(p => p.id === project.id);
        
        if (existingIndex >= 0) {
            projects[existingIndex] = project;
        } else {
            projects.push(project);
        }
        
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    private static deleteProjectFromLocalStorage(id: string): void {
        const projects = this.getProjectsFromLocalStorage();
        const filteredProjects = projects.filter(p => p.id !== id);
        localStorage.setItem("projects", JSON.stringify(filteredProjects));
    }

    private static searchProjectsInLocalStorage(term: string): Project[] {
        const projects = this.getProjectsFromLocalStorage();
        return projects.filter(project =>
            project.name.toLowerCase().includes(term.toLowerCase()) ||
            project.description.toLowerCase().includes(term.toLowerCase())
        );
    }
}

export default ProjectService;