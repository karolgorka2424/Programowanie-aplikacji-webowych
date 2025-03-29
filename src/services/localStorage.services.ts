import { Project } from "../models/Project";

class LocalStorageService {
    private static readonly PROJECTS_KEY = "projects";
  static saveProjects(projects: Project[]): void {
    const existingProjects = this.getProjects();
    const existingIndex = existingProjects.findIndex((project) => project.id === projects[0].id);
    if (existingIndex >= 0) {
        existingProjects[existingIndex] = projects[0];
    } else {
        existingProjects.push(projects[0]);
    }
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(existingProjects));
  }
  static getProjectById(id: string): Project | undefined {
    const projectsJson = LocalStorageService.getProjects();
    return projectsJson.find((project) => project.id === id);
  }

  static getProjects(): Project[] {
    const projects = localStorage.getItem("projects");
    return projects ? JSON.parse(projects) : [];
  }

  static clearProjects(): void {
    localStorage.removeItem("projects");
  }
  static deleteProject(id: string): void {
    const projects = this.getProjects();
    const updatedProjects = projects.filter((project) => project.id !== id);
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(updatedProjects));
  }
}
export default LocalStorageService;