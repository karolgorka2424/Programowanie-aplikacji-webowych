import React, { useState, useEffect } from 'react';
import { Task, TaskState } from '../models/Task';
import { User } from '../models/User';
import { Story } from '../models/Story';
import TaskService from '../services/task.service.ts';
import UserService from '../services/user.service.ts';
import StoryService from '../services/story.service.ts';
import ActiveProjectService from '../services/activeProject.service.ts';

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

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        const projectId = ActiveProjectService.getActiveProjectId();
        setActiveProjectId(projectId);
        
        if (projectId) {
            const projectTasks = TaskService.getTasksByProjectId(projectId);
            
            // Dodaj szczegóły użytkownika i historyjki do każdego zadania
            const tasksWithDetails: TaskWithDetails[] = projectTasks.map(task => {
                const assignedUser = task.assignedUserId 
                    ? UserService.getUserById(task.assignedUserId) 
                    : undefined;
                const story = StoryService.getStoryById(task.storyId);
                
                return {
                    ...task,
                    assignedUser,
                    story
                };
            });
            
            setTasks(tasksWithDetails);
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
            <p className="task-story">{task.story?.name || 'Brak historyjki'}</p>
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

    const renderColumn = (state: TaskState, title: string) => {
        const columnTasks = getTasksByState(state);
        
        return (
            <div className="kanban-column">
                <div className="kanban-column-header">
                    <h3>{title}</h3>
                    <span className="task-count">{columnTasks.length}</span>
                </div>
                <div className="kanban-column-content">
                    {columnTasks.length === 0 ? (
                        <p className="empty-column">Brak zadań</p>
                    ) : (
                        columnTasks.map(task => renderTaskCard(task))
                    )}
                </div>
            </div>
        );
    };

    if (!activeProjectId) {
        return (
            <div className="kanban-no-project">
                <p>Wybierz projekt, aby zobaczyć tablicę Kanban</p>
            </div>
        );
    }

    return (
        <div className="kanban-board">
            {renderColumn('todo', 'Do zrobienia')}
            {renderColumn('doing', 'W trakcie')}
            {renderColumn('done', 'Zakończone')}
        </div>
    );
};