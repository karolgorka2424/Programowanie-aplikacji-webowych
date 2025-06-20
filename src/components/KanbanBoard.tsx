import React, { useState, useEffect } from 'react';
import { Task, TaskState } from '../models/Task';
import { User } from '../models/User';
import { Story } from '../models/Story';
import TaskService from '../services/task.service'; // Zaktualizowany serwis
import UserService from '../services/user.service'; // Zaktualizowany serwis
import StoryService from '../services/story.service'; // Zaktualizowany serwis
import ActiveProjectService from '../services/activeProject.service';

interface KanbanBoardProps {
    onTaskClick: (task: Task) => void;
}

interface TaskWithDetails extends Task {
    assignedUser?: User;
    story?: Story;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onTaskClick }) => {
    const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const projectId = ActiveProjectService.getActiveProjectId();
            setActiveProjectId(projectId);
            
            if (projectId) {
                const projectTasks = await TaskService.getTasksByProjectId(projectId);
                
                // Dodaj szczegóły użytkownika i historyjki do każdego zadania
                const tasksWithDetails: TaskWithDetails[] = await Promise.all(
                    projectTasks.map(async (task) => {
                        const assignedUser = task.assignedUserId 
                            ? await UserService.getUserById(task.assignedUserId) 
                            : undefined;
                        const story = await StoryService.getStoryById(task.storyId);
                        
                        return {
                            ...task,
                            assignedUser,
                            story
                        };
                    })
                );
                
                setTasks(tasksWithDetails);
            } else {
                setTasks([]);
            }
        } catch (err) {
            setError('Błąd podczas ładowania zadań');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTasksByState = (state: TaskState): TaskWithDetails[] => {
        return tasks.filter(task => task.state === state);
    };

    const getPriorityClass = (priority: Task['priority']) => {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return '';
        }
    };

    const renderTaskCard = (task: TaskWithDetails) => (
        <div 
            key={task.id} 
            className={`kanban-task ${getPriorityClass(task.priority)}`}
            onClick={() => onTaskClick(task)}
        >
            <h4>{task.name}</h4>
            <p className="task-story">{task.story?.name || 'Ładowanie historyjki...'}</p>
            <div className="task-meta">
                <span className="task-time">{task.estimatedTime}h</span>
                {task.assignedUser && (
                    <span className="task-user">
                        {task.assignedUser.firstName} {task.assignedUser.lastName[0]}.
                    </span>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="kanban-board-loading">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-2 text-gray-600">Ładowanie tablicy Kanban...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="kanban-board-error">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                    <button 
                        onClick={loadTasks}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            </div>
        );
    }

    if (!activeProjectId) {
        return (
            <div className="kanban-no-project">
                <p>Wybierz projekt, aby zobaczyć tablicę Kanban</p>
            </div>
        );
    }

    const todoTasks = getTasksByState('todo');
    const doingTasks = getTasksByState('doing');
    const doneTasks = getTasksByState('done');

    return (
        <div className="kanban-board">
            <div className="kanban-column">
                <div className="kanban-column-header">
                    <h3>Do zrobienia</h3>
                    <span className="task-count">{todoTasks.length}</span>
                </div>
                <div className="kanban-column-content">
                    {todoTasks.length > 0 ? (
                        todoTasks.map(renderTaskCard)
                    ) : (
                        <div className="empty-column">
                            Brak zadań do zrobienia
                        </div>
                    )}
                </div>
            </div>

            <div className="kanban-column">
                <div className="kanban-column-header">
                    <h3>W trakcie</h3>
                    <span className="task-count">{doingTasks.length}</span>
                </div>
                <div className="kanban-column-content">
                    {doingTasks.length > 0 ? (
                        doingTasks.map(renderTaskCard)
                    ) : (
                        <div className="empty-column">
                            Brak zadań w trakcie
                        </div>
                    )}
                </div>
            </div>

            <div className="kanban-column">
                <div className="kanban-column-header">
                    <h3>Zakończone</h3>
                    <span className="task-count">{doneTasks.length}</span>
                </div>
                <div className="kanban-column-content">
                    {doneTasks.length > 0 ? (
                        doneTasks.map(renderTaskCard)
                    ) : (
                        <div className="empty-column">
                            Brak zakończonych zadań
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};