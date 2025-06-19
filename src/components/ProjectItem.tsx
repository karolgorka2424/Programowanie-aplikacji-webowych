import { Project } from "../models/Project";

interface ProjectItemProps {
    project: Project;
    onDelete: (id: string) => void;
    onEdit: (project: Project) => void;
}

export const ProjectItem = ({ project, onDelete, onEdit }: ProjectItemProps) => {
    const handleDelete = () => {
        if (window.confirm(`Czy na pewno chcesz usunąć projekt "${project.name}"?`)) {
            onDelete(project.id);
        }
    };

    return (
        <div className="card-hover group animate-fade-in">
            <div className="card-body">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                            {project.name}
                        </h3>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Projekt #{project.id.slice(-8)}
                        </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
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
            </div>

            {/* Actions */}
            <div className="card-footer">
                <div className="flex justify-between items-center">
                    {/* Left side - Last activity */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Utworzono niedawno
                    </div>
                    
                    {/* Right side - Action buttons */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(project)}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edytuj
                        </button>
                        
                        <button
                            onClick={handleDelete}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Usuń
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};