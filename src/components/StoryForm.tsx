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
        <form onSubmit={handleSubmit} className="story-form">
            <div>
                <label htmlFor="story-name">Nazwa historyjki:</label>
                <input
                    type="text"
                    id="story-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="story-description">Opis:</label>
                <textarea
                    id="story-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="story-priority">Priorytet:</label>
                <select
                    id="story-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                </select>
            </div>
            <div>
                <label htmlFor="story-state">Stan:</label>
                <select
                    id="story-state"
                    value={state}
                    onChange={(e) => setState(e.target.value as StoryState)}
                >
                    <option value="todo">Do zrobienia</option>
                    <option value="doing">W trakcie</option>
                    <option value="done">Zakończone</option>
                </select>
            </div>
            <div className="form-buttons">
                <button type="submit">{initialStory ? 'Zaktualizuj' : 'Dodaj'} historyjkę</button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>Anuluj</button>
                )}
            </div>
        </form>
    );
};