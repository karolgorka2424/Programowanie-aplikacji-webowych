import { useEffect, useState } from 'react';
import { Project } from '../models/Project';
import LocalStorageService from '../services/localStorage.service.ts';
import ActiveProjectService from '../services/activeProject.service.ts';

interface ProjectSelectorProps {
    onProjectChange?: (projectId: string | null) => void;
}

export const ProjectSelector = ({ onProjectChange }: ProjectSelectorProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

    useEffect(() => {
        const allProjects = LocalStorageService.getProjects();
        setProjects(allProjects);
        
        const currentActiveId = ActiveProjectService.getActiveProjectId();
        setActiveProjectId(currentActiveId);
    }, []);

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const projectId = e.target.value || null;
        
        if (projectId) {
            ActiveProjectService.setActiveProject(projectId);
        } else {
            ActiveProjectService.clearActiveProject();
        }
        
        setActiveProjectId(projectId);
        onProjectChange?.(projectId);
    };

    return (
        <div className="project-selector">
            <label htmlFor="project-select">Aktywny projekt:</label>
            <select 
                id="project-select"
                value={activeProjectId || ''} 
                onChange={handleProjectChange}
            >
                <option value="">-- Wybierz projekt --</option>
                {projects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
            </select>
        </div>
    );
};