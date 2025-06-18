import { useState, useEffect } from 'react';
import { Task } from '../models/Task';
import TaskService from '../services/task.service.ts';
import ActiveProjectService from '../services/activeProject.service.ts';
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
        <div className="tasks-page">
            <div className="page-header">
                <h1>Zadania</h1>
                <UserInfo />
            </div>
            
            <ProjectSelector onProjectChange={refreshTasks} />
            
            <div className="tasks-controls">
                <button 
                    className={viewMode === 'kanban' ? 'active' : ''}
                    onClick={() => setViewMode('kanban')}
                >
                    Tablica Kanban
                </button>
                <button 
                    className={viewMode === 'form' ? 'active' : ''}
                    onClick={() => setViewMode('form')}
                >
                    Dodaj zadanie
                </button>
            </div>

            {viewMode === 'kanban' ? (
                <KanbanBoard 
                    key={refreshKey}
                    onTaskClick={handleTaskClick} 
                />
            ) : (
                <div className="task-form-section">
                    <h2>Nowe zadanie</h2>
                    <TaskForm onSubmit={handleAddTask} />
                </div>
            )}

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