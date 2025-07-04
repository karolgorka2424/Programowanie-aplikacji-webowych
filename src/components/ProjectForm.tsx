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
        <div className="card animate-slide-up">
            <div className="card-header">
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
                <div className="card-body space-y-6">
                    <div className="form-group">
                        <label htmlFor="project-name" className="form-label">
                            Nazwa projektu *
                        </label>
                        <input
                            type="text"
                            id="project-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting}
                            placeholder="np. Aplikacja e-commerce"
                            className="form-input"
                            maxLength={100}
                        />
                        {name.length > 80 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {100 - name.length} znaków pozostało
                            </p>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="project-description" className="form-label">
                            Opis projektu
                        </label>
                        <textarea
                            id="project-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="Opisz cel i zakres projektu..."
                            className="form-textarea h-24"
                            maxLength={500}
                        />
                        {description.length > 400 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {500 - description.length} znaków pozostało
                            </p>
                        )}
                    </div>

                    {/* Preview */}
                    {name && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Podgląd:</h4>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        {name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{name}</p>
                                    {description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="card-footer">
                    <div className="flex justify-end space-x-3">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="btn-secondary"
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
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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