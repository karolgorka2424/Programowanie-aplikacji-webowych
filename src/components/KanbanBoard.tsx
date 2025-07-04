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

    const getPriorityBorderClass = (priority: Task['priority']) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 dark:border-l-red-400';
            case 'medium': return 'border-l-yellow-500 dark:border-l-yellow-400';
            case 'low': return 'border-l-green-500 dark:border-l-green-400';
            default: return 'border-l-gray-300 dark:border-l-gray-600';
        }
    };

    const renderTaskCard = (task: TaskWithDetails) => (
        <div 
            key={task.id} 
            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 ${getPriorityBorderClass(task.priority)}`}
            onClick={() => onTaskClick(task)}
        >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{task.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{task.story?.name || 'Brak historyjki'}</p>
            <div className="flex justify-between items-center text-xs">
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md">
                    {task.estimatedTime}h
                </span>
                {task.assignedUser && (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {task.assignedUser.firstName} {task.assignedUser.lastName[0]}.
                    </span>
                )}
            </div>
        </div>
    );

    const renderColumn = (state: TaskState, title: string) => {
        const columnTasks = getTasksByState(state);
        
        const getColumnHeaderClass = () => {
            switch (state) {
                case 'todo': return 'text-gray-600 dark:text-gray-400';
                case 'doing': return 'text-blue-600 dark:text-blue-400';
                case 'done': return 'text-green-600 dark:text-green-400';
                default: return 'text-gray-600 dark:text-gray-400';
            }
        };
        
        return (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${getColumnHeaderClass()}`}>{title}</h3>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                        {columnTasks.length}
                    </span>
                </div>
                <div className="flex-1 space-y-3">
                    {columnTasks.length === 0 ? (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Brak zadań</p>
                        </div>
                    ) : (
                        columnTasks.map(task => renderTaskCard(task))
                    )}
                </div>
            </div>
        );
    };

    if (!activeProjectId) {
        return (
            <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Wybierz projekt, aby zobaczyć tablicę Kanban</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderColumn('todo', 'Do zrobienia')}
            {renderColumn('doing', 'W trakcie')}
            {renderColumn('done', 'Zakończone')}
        </div>
    );
};