import React, { useState, useEffect } from 'react';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { Story } from '../models/Story';
import TaskService from '../services/task.service.ts';
import UserService from '../services/user.service.ts';
import StoryService from '../services/story.service.ts';

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

    useEffect(() => {
        // Pobierz użytkowników do przypisania (developer i devops)
        const users = UserService.getAssignableUsers();
        setAssignableUsers(users);

        // Pobierz historyjkę
        const taskStory = StoryService.getStoryById(task.storyId);
        setStory(taskStory);

        // Pobierz przypisanego użytkownika
        if (task.assignedUserId) {
            const user = UserService.getUserById(task.assignedUserId);
            setAssignedUser(user);
        }
    }, [task]);

    const handleAssignUser = () => {
        if (selectedUserId && task.state === 'todo') {
            TaskService.assignUserToTask(task.id, selectedUserId);
            onUpdate();
        }
    };

    const handleCompleteTask = () => {
        if (task.state === 'doing') {
            TaskService.completeTask(task.id);
            onUpdate();
        }
    };

    const formatDate = (date?: Date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    const calculateWorkingHours = () => {
        if (!task.startDate || !task.endDate) return null;
        const start = new Date(task.startDate);
        const end = new Date(task.endDate);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return Math.round(hours * 10) / 10; // Zaokrąglij do 1 miejsca po przecinku
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="card-header">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Szczegóły zadania</h2>
                    <button 
                        className="btn-secondary p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" 
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="card-body">
                    <div className="detail-group">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{task.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{task.description}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Stan:</span>
                            <span className={`status-badge status-${task.state}`}>
                                {getStateLabel(task.state)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Priorytet:</span>
                            <span className={`text-sm font-medium priority-${task.priority}`}>
                                {getPriorityLabel(task.priority)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Historyjka:</span>
                            <span className="text-gray-900 dark:text-gray-100">{story?.name || '-'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Przewidywany czas:</span>
                            <span className="text-gray-900 dark:text-gray-100">{task.estimatedTime} h</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Data utworzenia:</span>
                            <span className="text-gray-900 dark:text-gray-100">{formatDate(task.createdAt)}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Data rozpoczęcia:</span>
                            <span className="text-gray-900 dark:text-gray-100">{formatDate(task.startDate)}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Data zakończenia:</span>
                            <span className="text-gray-900 dark:text-gray-100">{formatDate(task.endDate)}</span>
                        </div>

                        {task.state === 'done' && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Czas realizacji:</span>
                                <span className="text-gray-900 dark:text-gray-100">{calculateWorkingHours()} h</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Przypisany użytkownik:</span>
                            <span className="text-gray-900 dark:text-gray-100">
                                {assignedUser 
                                    ? `${assignedUser.firstName} ${assignedUser.lastName} (${assignedUser.role})`
                                    : '-'
                                }
                            </span>
                        </div>
                    </div>

                    {/* Przypisywanie użytkownika */}
                    {task.state === 'todo' && (
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Przypisz użytkownika</h4>
                            <div className="form-group">
                                <select 
                                    value={selectedUserId} 
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="form-select mb-3"
                                >
                                    <option value="">-- Wybierz użytkownika --</option>
                                    {assignableUsers.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName} ({user.role})
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    onClick={handleAssignUser}
                                    disabled={!selectedUserId}
                                    className="btn btn-primary w-full"
                                >
                                    Przypisz i rozpocznij
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Zakończenie zadania */}
                    {task.state === 'doing' && (
                        <div className="mt-6 text-center">
                            <button 
                                onClick={handleCompleteTask}
                                className="btn btn-success px-8 py-3 text-lg font-semibold"
                            >
                                Zakończ zadanie
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};