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
                <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
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
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
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
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(project);
                                    }}
                                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Edytuj projekt"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Czy na pewno chcesz usunąć ten projekt?')) {
                                            onDelete(project.id);
                                        }
                                    }}
                                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Usuń projekt"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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