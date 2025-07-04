import { useState } from 'react';
import { Task } from '../models/Task';
import TaskService from '../services/task.service';
import { TaskForm } from '../components/TaskForm';
import { TaskDetails } from '../components/TaskDetails';
import { KanbanBoard } from '../components/KanbanBoard';
import { ProjectSelector } from '../components/ProjectSelector';
import { UserInfo } from '../components/UserInfo';

export const TasksPage = () => {
    const [viewMode, setViewMode] = useState<'kanban' | 'form'>('kanban');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshTasks = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleAddTask = (taskData: Omit<Task, 'id'>) => {
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID()
        };
        
        TaskService.saveTask(newTask);
        refreshTasks();
        setViewMode('kanban');
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setShowTaskDetails(true);
    };

    const handleCloseDetails = () => {
        setShowTaskDetails(false);
        setSelectedTask(null);
    };

    const handleTaskUpdate = () => {
        refreshTasks();
        handleCloseDetails();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Zadania
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Zarządzaj zadaniami w projekcie
                    </p>
                </div>
                <UserInfo />
            </div>
            
            <ProjectSelector onProjectChange={refreshTasks} />
            
            {/* View mode switcher */}
            <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
                <button 
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        viewMode === 'kanban' 
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setViewMode('kanban')}
                >
                    Tablica Kanban
                </button>
                <button 
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        viewMode === 'form' 
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setViewMode('form')}
                >
                    Dodaj zadanie
                </button>
            </div>

            {/* Content */}
            {viewMode === 'kanban' ? (
                <KanbanBoard 
                    key={refreshKey}
                    onTaskClick={handleTaskClick} 
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Nowe zadanie
                        </h2>
                    </div>
                    <div className="p-6">
                        <TaskForm onSubmit={handleAddTask} />
                    </div>
                </div>
            )}

            {/* Task details modal */}
            {showTaskDetails && selectedTask && (
                <TaskDetails
                    task={selectedTask}
                    onUpdate={handleTaskUpdate}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );
};