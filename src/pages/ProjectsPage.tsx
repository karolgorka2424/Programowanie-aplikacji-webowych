import { useState, useEffect } from "react";
import { Project } from "../models/Project";
import ProjectService from "../services/project.service"; // Zaktualizowany serwis
import { ProjectList } from "../components/ProjectList";
import ProjectForm from "../components/ProjectForm";
import { UserInfo } from "../components/UserInfo";

export const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const projectsList = await ProjectService.getProjects();
            setProjects(projectsList);
        } catch (err) {
            setError('Błąd podczas ładowania projektów');
            console.error('Error loading projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = async (project: { name: string; description: string }) => {
        setLoading(true);
        try {
            const newProject: Project = { 
                ...project, 
                id: crypto.randomUUID() // Tymczasowe ID, zostanie zastąpione przez MongoDB
            };
            await ProjectService.saveProject(newProject);
            await loadProjects(); // Przeładuj listę projektów
            setShowForm(false);
        } catch (err) {
            setError('Błąd podczas dodawania projektu');
            console.error('Error adding project:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProject = async (project: Project) => {
        setLoading(true);
        try {
            await ProjectService.saveProject(project);
            await loadProjects();
            setSelectedProject(null);
        } catch (err) {
            setError('Błąd podczas edycji projektu');
            console.error('Error editing project:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm('Czy na pewno chcesz usunąć ten projekt?')) return;
        
        setLoading(true);
        try {
            await ProjectService.deleteProject(id);
            await loadProjects();
        } catch (err) {
            setError('Błąd podczas usuwania projektu');
            console.error('Error deleting project:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term: string) => {
        if (!term.trim()) {
            await loadProjects();
            return;
        }
        
        setLoading(true);
        try {
            const searchResults = await ProjectService.searchProjects(term);
            setProjects(searchResults);
        } catch (err) {
            setError('Błąd podczas wyszukiwania');
            console.error('Error searching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = searchTerm 
        ? projects.filter(project =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : projects;

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

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                    <span className="block sm:inline">{error}</span>
                    <button 
                        onClick={() => setError(null)}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Szukaj projektów..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                        disabled={loading}
                    />
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    disabled={loading}
                    className="btn-primary whitespace-nowrap"
                >
                    {loading ? 'Ładowanie...' : '+ Nowy projekt'}
                </button>
            </div>

            {/* Project form */}
            {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
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

            {/* Loading indicator */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Ładowanie...</p>
                </div>
            )}

            {/* Projects list */}
            {!loading && (
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
                                    onClick={() => {
                                        setSearchTerm("");
                                        loadProjects();
                                    }}
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
                            onEdit={(project) => {
                                setSelectedProject(project);
                                setShowForm(true);
                            }}
                            onDelete={handleDeleteProject}
                        />
                    )}
                </div>
            )}
        </div>
    );
};