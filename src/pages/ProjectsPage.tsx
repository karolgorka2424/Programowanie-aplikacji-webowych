import { useState, useEffect } from "react";
import { Project } from "../models/Project";
import localStorageService from "../services/localStorage.service";
import { ProjectList } from "../components/ProjectList";
import ProjectForm from "../components/ProjectForm";
import { UserInfo } from "../components/UserInfo";

export const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const storedProjects = localStorageService.getProjects();
        setProjects(storedProjects);
    }, []);

    const handleAddProject = (project: { name: string; description: string }) => {
        const newProject: Project = { ...project, id: crypto.randomUUID() };
        localStorageService.saveProjects([newProject]);
        setProjects([...projects, newProject]);
        setShowForm(false);
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

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Projekty
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Zarządzaj swoimi projektami i ich postępem
                    </p>
                </div>
                <UserInfo />
            </div>

            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Szukaj projektów..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pl-10"
                    />
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{projects.length}</span>
                        <span className="ml-1">projektów</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-green-600 dark:text-green-400">0</span>
                        <span className="ml-1">aktywnych</span>
                    </div>
                </div>

                {/* Add button */}
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nowy projekt
                </button>
            </div>

            {/* Form */}
            {(showForm || selectedProject) && (
                <div className="animate-slide-up">
                    <ProjectForm 
                        onSubmit={selectedProject 
                            ? (project) => {
                                if (selectedProject) {
                                    handleEditProject({ ...selectedProject, ...project });
                                }
                            }
                            : handleAddProject
                        }
                        initialProject={selectedProject ? { name: selectedProject.name, description: selectedProject.description } : undefined}
                        onCancel={() => {
                            setShowForm(false);
                            setSelectedProject(null);
                        }}
                    />
                </div>
            )}

            {/* Projects list */}
            <div className="space-y-6">
                {searchTerm && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Znaleziono {filteredProjects.length} projekt{filteredProjects.length === 1 ? '' : filteredProjects.length < 5 ? 'y' : 'ów'} 
                            {searchTerm && (
                                <>
                                    {' '}dla "{searchTerm}"
                                </>
                            )}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                            >
                                Wyczyść
                            </button>
                        )}
                    </div>
                )}

                {filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {searchTerm ? 'Brak wyników' : 'Brak projektów'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            {searchTerm 
                                ? `Nie znaleziono projektów pasujących do "${searchTerm}"`
                                : 'Rozpocznij od utworzenia swojego pierwszego projektu'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-primary"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Utwórz pierwszy projekt
                            </button>
                        )}
                    </div>
                ) : (
                    <ProjectList
                        projects={filteredProjects}
                        onEdit={(project) => setSelectedProject(project)}
                        onDelete={handleDeleteProject}
                    />
                )}
            </div>
        </div>
    );
};