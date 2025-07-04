import { Project } from "../models/Project";

interface ProjectListProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

export const ProjectList = ({ projects, onEdit, onDelete }: ProjectListProps) => {
    const getProjectInitial = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    const getRandomGradient = (index: number) => {
        const gradients = [
            'from-blue-500 to-purple-600',
            'from-green-500 to-teal-600', 
            'from-purple-500 to-pink-600',
            'from-orange-500 to-red-600',
            'from-indigo-500 to-blue-600',
            'from-pink-500 to-rose-600',
            'from-teal-500 to-cyan-600',
            'from-yellow-500 to-orange-600'
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
                <div key={project.id} className="project-card group">
                    {/* Header */}
                    <div className="p-6 pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 bg-gradient-to-r ${getRandomGradient(index)} rounded-lg flex items-center justify-center`}>
                                    <span className="text-white text-lg font-bold">
                                        {getProjectInitial(project.name)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Projekt
                                    </p>
                                </div>
                            </div>
                            
                            {/* Status badge */}
                            <span className="status-badge status-active">
                                Aktywny
                            </span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 pb-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                            {project.description || 'Brak opisu projektu'}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">0</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Historyjki</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">0</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Zadania</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-green-600 dark:text-green-400">0%</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Ukończone</div>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                            <div 
                                className={`bg-gradient-to-r ${getRandomGradient(index)} h-2 rounded-full transition-all duration-300`}
                                style={{ width: '0%' }}
                            ></div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Postęp: 0%</span>
                            <span>Utworzono niedawno</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            {/* Last activity */}
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Ostatnia aktywność
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => onEdit(project)}
                                    className="btn-secondary-sm group/btn"
                                    title="Edytuj projekt"
                                >
                                    <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => {
                                        if (window.confirm('Czy na pewno chcesz usunąć ten projekt?')) {
                                            onDelete(project.id);
                                        }
                                    }}
                                    className="btn-danger-sm group/btn"
                                    title="Usuń projekt"
                                >
                                    <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                                <button 
                                    className="btn-primary-sm group/btn"
                                    title="Zobacz szczegóły"
                                >
                                    <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};