import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskState } from '../models/Task';
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
        <form onSubmit={handleSubmit} className="task-form">
            <div>
                <label htmlFor="task-name">Nazwa zadania:</label>
                <input
                    type="text"
                    id="task-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="task-description">Opis:</label>
                <textarea
                    id="task-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="task-story">Historyjka:</label>
                <select
                    id="task-story"
                    value={storyId}
                    onChange={(e) => setStoryId(e.target.value)}
                    required
                    disabled={!!preselectedStoryId}
                >
                    <option value="">-- Wybierz historyjkę --</option>
                    {stories.map(story => (
                        <option key={story.id} value={story.id}>
                            {story.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="task-priority">Priorytet:</label>
                <select
                    id="task-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                </select>
            </div>
            <div>
                <label htmlFor="task-estimated-time">Przewidywany czas (w godzinach):</label>
                <input
                    type="number"
                    id="task-estimated-time"
                    min="0.5"
                    step="0.5"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(parseFloat(e.target.value))}
                    required
                />
            </div>
            <div className="form-buttons">
                <button type="submit">{initialTask ? 'Zaktualizuj' : 'Dodaj'} zadanie</button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>Anuluj</button>
                )}
            </div>
        </form>
    );
};