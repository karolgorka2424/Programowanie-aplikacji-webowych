import React, { useState } from 'react';
import { Story, Priority, StoryState } from '../models/Story';
import UserService from '../services/user.service.ts';
import ActiveProjectService from '../services/activeProject.service.ts';

interface StoryFormProps {
    onSubmit: (story: Omit<Story, 'id'>) => void;
    initialStory?: Story;
    onCancel?: () => void;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, initialStory, onCancel }) => {
    const [name, setName] = useState(initialStory?.name || '');
    const [description, setDescription] = useState(initialStory?.description || '');
    const [priority, setPriority] = useState<Priority>(initialStory?.priority || 'medium');
    const [state, setState] = useState<StoryState>(initialStory?.state || 'todo');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const activeProjectId = ActiveProjectService.getActiveProjectId();
        if (!activeProjectId) {
            alert('Wybierz najpierw aktywny projekt!');
            return;
        }

        const currentUser = await UserService.getCurrentUser();
        if (!currentUser) {
            alert('Nie można pobrać danych użytkownika!');
            return;
        }
        
        onSubmit({
            name,
            description,
            priority,
            state,
            projectId: activeProjectId,
            ownerId: currentUser.id,
            createdAt: initialStory?.createdAt || new Date()
        });

        if (!initialStory) {
            setName('');
            setDescription('');
            setPriority('medium');
            setState('todo');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                    <label htmlFor="story-name" className="form-label">
                        Nazwa historyjki:
                    </label>
                    <input
                        type="text"
                        id="story-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="story-description" className="form-label">
                        Opis:
                    </label>
                    <textarea
                        id="story-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="form-textarea"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="story-priority" className="form-label">
                        Priorytet:
                    </label>
                    <select
                        id="story-priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="form-select"
                    >
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="story-state" className="form-label">
                        Stan:
                    </label>
                    <select
                        id="story-state"
                        value={state}
                        onChange={(e) => setState(e.target.value as StoryState)}
                        className="form-select"
                    >
                        <option value="todo">Do zrobienia</option>
                        <option value="doing">W trakcie</option>
                        <option value="done">Zakończone</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    {onCancel && (
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="btn btn-secondary"
                        >
                            Anuluj
                        </button>
                    )}
                    <button 
                        type="submit"
                        className="btn btn-primary"
                    >
                        {initialStory ? 'Zaktualizuj' : 'Dodaj'} historyjkę
                    </button>
                </div>
            </form>
        </div>
    );
};