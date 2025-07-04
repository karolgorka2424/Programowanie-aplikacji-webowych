import { useEffect, useState } from 'react';
import { Project } from '../models/Project';
import LocalStorageService from '../services/localStorage.service';
import ActiveProjectService from '../services/activeProject.service';

interface ProjectSelectorProps {
    onProjectChange?: (projectId: string | null) => void;
}

export const ProjectSelector = ({ onProjectChange }: ProjectSelectorProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const allProjects = LocalStorageService.getProjects();
        setProjects(allProjects);
        
        const currentActiveId = ActiveProjectService.getActiveProjectId();
        setActiveProjectId(currentActiveId);
    }, []);

    const handleProjectChange = (projectId: string | null) => {
        if (projectId) {
            ActiveProjectService.setActiveProject(projectId);
        } else {
            ActiveProjectService.clearActiveProject();
        }
        
        setActiveProjectId(projectId);
        setIsOpen(false);
        onProjectChange?.(projectId);
    };

    const activeProject = projects.find(p => p.id === activeProjectId);

    return (
        <div className="project-selector">
            <label className="form-label">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Aktywny projekt
            </label>
            
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full form-input flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        {activeProject ? (
                            <>
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        {activeProject.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-gray-900 dark:text-gray-100 font-medium">
                                    {activeProject.name}
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Wybierz projekt...
                                </span>
                            </>
                        )}
                    </div>
                    <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="dropdown-menu">
                        {/* Clear selection */}
                        <button
                            type="button"
                            onClick={() => handleProjectChange(null)}
                            className="dropdown-item"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Brak aktywnego projektu
                                </span>
                            </div>
                        </button>

                        {projects.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                        )}

                        {/* Project options */}
                        {projects.map((project, index) => {
                            const gradients = [
                                'from-blue-500 to-purple-600',
                                'from-green-500 to-teal-600', 
                                'from-purple-500 to-pink-600',
                                'from-orange-500 to-red-600',
                                'from-indigo-500 to-blue-600',
                                'from-pink-500 to-rose-600',
                            ];
                            const gradient = gradients[index % gradients.length];

                            return (
                                <button
                                    key={project.id}
                                    type="button"
                                    onClick={() => handleProjectChange(project.id)}
                                    className={`dropdown-item ${activeProjectId === project.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-6 h-6 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
                                            <span className="text-white text-xs font-bold">
                                                {project.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {project.name}
                                            </div>
                                            {project.description && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                    {project.description}
                                                </div>
                                            )}
                                        </div>
                                        {activeProjectId === project.id && (
                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            );
                        })}

                        {projects.length === 0 && (
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                Brak dostępnych projektów
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Click outside to close */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
};