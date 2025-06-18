import { useState, useEffect } from "react";
import { Project } from "../models/Project";
import localStorageService from "../services/localStorage.service.ts";
import { ProjectList } from "../components/ProjectList";
import ProjectForm from "../components/ProjectForm";

export const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const storedProjects = localStorageService.getProjects();
        setProjects(storedProjects);
    }, []);

    const handleAddProject = (project: { name: string; description: string }) => {
        const newProject: Project = { ...project, id: crypto.randomUUID() };
        localStorageService.saveProjects([newProject]);
        setProjects([...projects, newProject]);
    };

    const handleEditProject = (project: Project) => {
        localStorageService.saveProjects([project]);
        setProjects(
            projects.map((p) => (p.id === project.id ? project : p))
        );
        setSelectedProject(null);
    };

    const handleDeleteProject = (id: string) => {
        localStorageService.deleteProject(id);
        setProjects(projects.filter((project) => project.id !== id));
    };

    return (
        <div>
            <h1>Projects</h1>
            <ProjectForm onSubmit={handleAddProject} />
            <ProjectList
                projects={projects}
                onEdit={(project) => setSelectedProject(project)}
                onDelete={handleDeleteProject}
            />
        </div>
    );
}