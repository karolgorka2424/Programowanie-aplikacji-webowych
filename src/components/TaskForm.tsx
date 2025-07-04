import React, { useState, useEffect } from 'react';
import { Task, TaskPriority } from '../models/Task';
import { Story } from '../models/Story';
import StoryService from '../services/story.service.ts';
import ActiveProjectService from '../services/activeProject.service.ts';

interface TaskFormProps {
    onSubmit: (task: Omit<Task, 'id'>) => void;
    initialTask?: Task;
    onCancel?: () => void;
    preselectedStoryId?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
    onSubmit, 
    initialTask, 
    onCancel,
    preselectedStoryId 
}) => {
    const [name, setName] = useState(initialTask?.name || '');
    const [description, setDescription] = useState(initialTask?.description || '');
    const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'medium');
    const [storyId, setStoryId] = useState(initialTask?.storyId || preselectedStoryId || '');
    const [estimatedTime, setEstimatedTime] = useState(initialTask?.estimatedTime || 1);
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
        const activeProjectId = ActiveProjectService.getActiveProjectId();
        if (activeProjectId) {
            const projectStories = StoryService.getStoriesByProjectId(activeProjectId);
            setStories(projectStories);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!storyId) {
            alert('Wybierz historyjkę!');
            return;
        }

        onSubmit({
            name,
            description,
            priority,
            storyId,
            estimatedTime,
            state: initialTask?.state || 'todo',
            createdAt: initialTask?.createdAt || new Date(),
            startDate: initialTask?.startDate,
            endDate: initialTask?.endDate,
            assignedUserId: initialTask?.assignedUserId
        });

        if (!initialTask) {
            setName('');
            setDescription('');
            setPriority('medium');
            setEstimatedTime(1);
            if (!preselectedStoryId) {
                setStoryId('');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                    <label htmlFor="task-name" className="form-label">
                        Nazwa zadania:
                    </label>
                    <input
                        type="text"
                        id="task-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="task-description" className="form-label">
                        Opis:
                    </label>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="form-textarea"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="task-story" className="form-label">
                        Historyjka:
                    </label>
                    <select
                        id="task-story"
                        value={storyId}
                        onChange={(e) => setStoryId(e.target.value)}
                        required
                        disabled={!!preselectedStoryId}
                        className="form-select"
                    >
                        <option value="">-- Wybierz historyjkę --</option>
                        {stories.map(story => (
                            <option key={story.id} value={story.id}>
                                {story.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="task-priority" className="form-label">
                        Priorytet:
                    </label>
                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        className="form-select"
                    >
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="task-estimated-time" className="form-label">
                        Przewidywany czas (w godzinach):
                    </label>
                    <input
                        type="number"
                        id="task-estimated-time"
                        min="0.5"
                        step="0.5"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(parseFloat(e.target.value))}
                        required
                        className="form-input"
                    />
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
                        {initialTask ? 'Zaktualizuj' : 'Dodaj'} zadanie
                    </button>
                </div>
            </form>
        </div>
    );
};