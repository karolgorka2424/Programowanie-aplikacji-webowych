import React, { useState } from 'react';

interface ProjectFormProps {
    onSubmit: (project: { name: string; description: string }) => void;
    initialProject?: { name: string; description: string };
    onCancel?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialProject, onCancel }) => {
    const [name, setName] = useState(initialProject?.name || '');
    const [description, setDescription] = useState(initialProject?.description || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        setIsSubmitting(true);
        
        try {
            onSubmit({ name: name.trim(), description: description.trim() });
            if (!initialProject) {
                setName('');
                setDescription('');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700" style={{animation: 'slideUp 0.3s ease-out'}}>
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={initialProject ? "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {initialProject ? 'Edytuj projekt' : 'Nowy projekt'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {initialProject ? 'Zaktualizuj informacje o projekcie' : 'Utwórz nowy projekt dla swojego zespołu'}
                        </p>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-6">
                    <div>
                        <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nazwa projektu *
                        </label>
                        <input
                            type="text"
                            id="project-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting}
                            placeholder="np. Aplikacja mobilna"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Opis projektu
                        </label>
                        <textarea
                            id="project-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            disabled={isSubmitting}
                            placeholder="Opisz cel i zakres projektu..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Pomóż zespołowi zrozumieć, nad czym będziecie pracować
                        </p>
                    </div>

                    {/* Preview */}
                    {(name || description) && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                PODGLĄD
                            </div>
                            <div className="space-y-2">
                                {name && (
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Nazwa:</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{name}</div>
                                    </div>
                                )}
                                {description && (
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Opis:</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-end space-x-3">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Anuluj
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!name.trim() || isSubmitting}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {initialProject ? 'Zapisywanie...' : 'Tworzenie...'}
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={initialProject ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                                    </svg>
                                    {initialProject ? 'Zapisz zmiany' : 'Utwórz projekt'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;