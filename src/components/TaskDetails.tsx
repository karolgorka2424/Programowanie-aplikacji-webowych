import React, { useState, useEffect } from 'react';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { Story } from '../models/Story';
import TaskService from '../services/task.service'; // Zaktualizowany serwis
import UserService from '../services/user.service'; // Zaktualizowany serwis
import StoryService from '../services/story.service'; // Zaktualizowany serwis

interface TaskDetailsProps {
    task: Task;
    onUpdate: () => void;
    onClose: () => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onUpdate, onClose }) => {
    const [assignableUsers, setAssignableUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState(task.assignedUserId || '');
    const [story, setStory] = useState<Story | undefined>();
    const [assignedUser, setAssignedUser] = useState<User | undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTaskDetails();
    }, [task]);

    const loadTaskDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            // Pobierz użytkowników do przypisania (developer i devops)
            const users = await UserService.getAssignableUsers();
            setAssignableUsers(users);

            // Pobierz historyjkę
            const taskStory = await StoryService.getStoryById(task.storyId);
            setStory(taskStory);

            // Pobierz przypisanego użytkownika
            if (task.assignedUserId) {
                const user = await UserService.getUserById(task.assignedUserId);
                setAssignedUser(user);
            }
        } catch (err) {
            setError('Błąd podczas ładowania szczegółów zadania');
            console.error('Error loading task details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignUser = async () => {
        if (!selectedUserId || task.state !== 'todo') return;
        
        setLoading(true);
        try {
            await TaskService.assignUserToTask(task.id, selectedUserId);
            onUpdate();
        } catch (err) {
            setError('Błąd podczas przypisywania użytkownika');
            console.error('Error assigning user:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteTask = async () => {
        if (task.state !== 'doing') return;
        
        setLoading(true);
        try {
            await TaskService.completeTask(task.id);
            onUpdate();
        } catch (err) {
            setError('Błąd podczas kończenia zadania');
            console.error('Error completing task:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date?: Date) => {
        if (!date) return 'Nie ustawiono';
        return new Date(date).toLocaleString('pl-PL');
    };

    const getStateLabel = (state: Task['state']) => {
        switch (state) {
            case 'todo': return 'Do zrobienia';
            case 'doing': return 'W trakcie';
            case 'done': return 'Zakończone';
            default: return state;
        }
    };

    const getPriorityLabel = (priority: Task['priority']) => {
        switch (priority) {
            case 'high': return 'Wysoki';
            case 'medium': return 'Średni';
            case 'low': return 'Niski';
            default: return priority;
        }
    };

    return (
        <div className="task-details-modal">
            <div className="task-details-content">
                <div className="task-details-header">
                    <h2>{task.name}</h2>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                        <button 
                            onClick={() => setError(null)}
                            className="float-right"
                        >
                            ×
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        <p className="mt-2 text-gray-600">Ładowanie...</p>
                    </div>
                )}

                <div className="task-details-body">
                    <div className="task-info">
                        <h3>Informacje o zadaniu</h3>
                        <p><strong>Opis:</strong> {task.description}</p>
                        <p><strong>Priorytet:</strong> {getPriorityLabel(task.priority)}</p>
                        <p><strong>Status:</strong> {getStateLabel(task.state)}</p>
                        <p><strong>Szacowany czas:</strong> {task.estimatedTime}h</p>
                        <p><strong>Historyjka:</strong> {story?.name || 'Ładowanie...'}</p>
                        <p><strong>Data utworzenia:</strong> {formatDate(task.createdAt)}</p>
                        {task.startDate && (
                            <p><strong>Data rozpoczęcia:</strong> {formatDate(task.startDate)}</p>
                        )}
                        {task.endDate && (
                            <p><strong>Data zakończenia:</strong> {formatDate(task.endDate)}</p>
                        )}
                    </div>

                    <div className="task-assignment">
                        <h3>Przypisanie użytkownika</h3>
                        {assignedUser ? (
                            <p><strong>Przypisany użytkownik:</strong> {assignedUser.firstName} {assignedUser.lastName}</p>
                        ) : (
                            <p>Zadanie nie jest przypisane</p>
                        )}

                        {task.state === 'todo' && (
                            <div className="assign-user-form">
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    disabled={loading}
                                    className="form-select"
                                >
                                    <option value="">Wybierz użytkownika</option>
                                    {assignableUsers.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName} ({user.role})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAssignUser}
                                    disabled={!selectedUserId || loading}
                                    className="btn-primary"
                                >
                                    {loading ? 'Przypisywanie...' : 'Przypisz użytkownika'}
                                </button>
                            </div>
                        )}

                        {task.state === 'doing' && (
                            <div className="complete-task-form">
                                <button
                                    onClick={handleCompleteTask}
                                    disabled={loading}
                                    className="btn-success"
                                >
                                    {loading ? 'Kończenie...' : 'Oznacz jako zakończone'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};