import { ProjectWithoutId, Project, ProjectId } from "../models/project.model";
import { dbService } from "./db.service";

class ProjectsService {
    private collectionName = 'projects';

    getProjects() {
        return dbService.find<Project>({}, this.collectionName);
    }

    getProject(id: ProjectId) {
        return dbService.findOne<Project>(id, this.collectionName);
    }

    async createProject(project: ProjectWithoutId) {
        const projectWithTimestamps = {
            ...project,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return dbService.create(projectWithTimestamps, this.collectionName);
    }

    updateProject(id: string, project: Partial<ProjectWithoutId>) {
        const projectWithTimestamp = {
            ...project,
            updatedAt: new Date()
        };
        return dbService.patch(id, projectWithTimestamp, this.collectionName);
    }

    replaceProject(id: string, project: ProjectWithoutId) {
        const projectWithTimestamps = {
            ...project,
            updatedAt: new Date()
        };
        return dbService.replace(id, projectWithTimestamps, this.collectionName);
    }

    deleteProject(id: ProjectId) {
        return dbService.delete(id, this.collectionName);
    }

    // Dodatkowe metody
    async searchProjects(searchTerm: string) {
        const query = {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        };
        return dbService.find<Project>(query, this.collectionName);
    }
}

export const projectsService = new ProjectsService();