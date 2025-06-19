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
        setIsSubmitting(true);
        
        try {
            onSubmit({ name, description });
            if (!initialProject) {
                setName('');
                setDescription('');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {initialProject ? 'Edytuj projekt' : 'Nowy projekt'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {initialProject ? 'Zaktualizuj informacje o projekcie' : 'Utwórz nowy projekt dla swojego zespołu'}
                </p>
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
                            placeholder="np. System zarządzania projektami"
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="project-description" className="form-label">
                            Opis projektu *
                        </label>
                        <textarea
                            id="project-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            disabled={isSubmitting}
                            placeholder="Opisz cel i zakres projektu..."
                            className="form-textarea"
                            rows={4}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Opisz główne cele i funkcjonalności projektu
                        </p>
                    </div>
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
                                Anuluj
                            </button>
                        )}
                        <button 
                            type="submit"
                            disabled={isSubmitting || !name.trim() || !description.trim()}
                            className="btn-primary"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {initialProject ? 'Aktualizowanie...' : 'Tworzenie...'}
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    {initialProject ? 'Zaktualizuj projekt' : 'Utwórz projekt'}
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