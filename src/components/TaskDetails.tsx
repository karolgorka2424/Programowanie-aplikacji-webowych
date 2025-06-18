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
        <div className="task-details-modal">
            <div className="task-details-content">
                <div className="task-details-header">
                    <h2>Szczegóły zadania</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="task-details-body">
                    <div className="detail-group">
                        <h3>{task.name}</h3>
                        <p className="task-description">{task.description}</p>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Stan:</span>
                        <span className={`task-state state-${task.state}`}>
                            {getStateLabel(task.state)}
                        </span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Priorytet:</span>
                        <span className={`priority-${task.priority}`}>
                            {getPriorityLabel(task.priority)}
                        </span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Historyjka:</span>
                        <span>{story?.name || '-'}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Przewidywany czas:</span>
                        <span>{task.estimatedTime} h</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Data utworzenia:</span>
                        <span>{formatDate(task.createdAt)}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Data rozpoczęcia:</span>
                        <span>{formatDate(task.startDate)}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Data zakończenia:</span>
                        <span>{formatDate(task.endDate)}</span>
                    </div>

                    {task.state === 'done' && (
                        <div className="detail-row">
                            <span className="detail-label">Czas realizacji:</span>
                            <span>{calculateWorkingHours()} h</span>
                        </div>
                    )}

                    <div className="detail-row">
                        <span className="detail-label">Przypisany użytkownik:</span>
                        <span>
                            {assignedUser 
                                ? `${assignedUser.firstName} ${assignedUser.lastName} (${assignedUser.role})`
                                : '-'
                            }
                        </span>
                    </div>

                    {/* Przypisywanie użytkownika */}
                    {task.state === 'todo' && (
                        <div className="assign-user-section">
                            <h4>Przypisz użytkownika</h4>
                            <select 
                                value={selectedUserId} 
                                onChange={(e) => setSelectedUserId(e.target.value)}
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
                            >
                                Przypisz i rozpocznij
                            </button>
                        </div>
                    )}

                    {/* Zakończenie zadania */}
                    {task.state === 'doing' && (
                        <div className="complete-task-section">
                            <button 
                                className="complete-button"
                                onClick={handleCompleteTask}
                            >
                                Oznacz jako zakończone
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};