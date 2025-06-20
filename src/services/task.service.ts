import { Task, TaskState } from "../models/Task";
import MongoDBService from "./mongodb.service";

class TaskService {
    private static tasks: Task[] = [];
    private static useLocalStorage = false;

    static async getTasks(): Promise<Task[]> {
        try {
            if (this.useLocalStorage) {
                return this.getTasksFromLocalStorage();
            }
            const tasks = await MongoDBService.getTasks();
            this.tasks = tasks.map(this.transformMongoTask);
            return this.tasks;
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.getTasksFromLocalStorage();
        }
    }

    static async getTasksByProjectId(projectId: string): Promise<Task[]> {
        try {
            if (this.useLocalStorage) {
                return this.getTasksFromLocalStorageByProject(projectId);
            }
            const tasks = await MongoDBService.getTasksByProject(projectId);
            return tasks.map(this.transformMongoTask);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.getTasksFromLocalStorageByProject(projectId);
        }
    }

    static async getTasksByStoryId(storyId: string): Promise<Task[]> {
        try {
            if (this.useLocalStorage) {
                return this.getTasksFromLocalStorageByStory(storyId);
            }
            const tasks = await MongoDBService.getTasksByStory(storyId);
            return tasks.map(this.transformMongoTask);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.getTasksFromLocalStorageByStory(storyId);
        }
    }

    static async getTaskById(id: string): Promise<Task | undefined> {
        try {
            if (this.useLocalStorage) {
                return this.getTaskFromLocalStorage(id);
            }
            const task = await MongoDBService.getTask(id);
            return task ? this.transformMongoTask(task) : undefined;
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.getTaskFromLocalStorage(id);
        }
    }

    static async saveTask(task: Task): Promise<void> {
        try {
            if (this.useLocalStorage) {
                return this.saveTaskToLocalStorage(task);
            }

            const taskData = {
                name: task.name,
                description: task.description,
                priority: task.priority,
                storyId: task.storyId,
                estimatedTime: task.estimatedTime,
                state: task.state,
                assignedUserId: task.assignedUserId,
                startDate: task.startDate,
                endDate: task.endDate
            };

            if (this.tasks.find(t => t.id === task.id)) {
                await MongoDBService.updateTask(task.id, taskData);
            } else {
                const result = await MongoDBService.createTask(taskData);
                task.id = result.id;
            }

            const existingIndex = this.tasks.findIndex(t => t.id === task.id);
            if (existingIndex >= 0) {
                this.tasks[existingIndex] = task;
            } else {
                this.tasks.push(task);
            }
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.saveTaskToLocalStorage(task);
        }
    }

    static async deleteTask(id: string): Promise<void> {
        try {
            if (this.useLocalStorage) {
                return this.deleteTaskFromLocalStorage(id);
            }
            await MongoDBService.deleteTask(id);
            this.tasks = this.tasks.filter(t => t.id !== id);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.deleteTaskFromLocalStorage(id);
        }
    }

    static async assignUserToTask(taskId: string, userId: string): Promise<void> {
        try {
            if (this.useLocalStorage) {
                return this.assignUserToTaskInLocalStorage(taskId, userId);
            }
            await MongoDBService.assignUserToTask(taskId, userId);
            
            // Aktualizuj cache
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.assignedUserId = userId;
                task.state = 'doing';
                task.startDate = new Date();
            }
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.assignUserToTaskInLocalStorage(taskId, userId);
        }
    }

    static async completeTask(taskId: string): Promise<void> {
        try {
            if (this.useLocalStorage) {
                return this.completeTaskInLocalStorage(taskId);
            }
            await MongoDBService.completeTask(taskId);
            
            // Aktualizuj cache
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.state = 'done';
                task.endDate = new Date();
            }
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.completeTaskInLocalStorage(taskId);
        }
    }

    static getTasksByState(state: TaskState): Task[] {
        return this.tasks.filter(task => task.state === state);
    }

    static getTasksByUserId(userId: string): Task[] {
        return this.tasks.filter(task => task.assignedUserId === userId);
    }

    // Metody pomocnicze
    private static transformMongoTask(mongoTask: any): Task {
        return {
            id: mongoTask._id.toString(),
            name: mongoTask.name,
            description: mongoTask.description,
            priority: mongoTask.priority,
            storyId: mongoTask.storyId,
            estimatedTime: mongoTask.estimatedTime,
            state: mongoTask.state,
            createdAt: new Date(mongoTask.createdAt),
            assignedUserId: mongoTask.assignedUserId,
            startDate: mongoTask.startDate ? new Date(mongoTask.startDate) : undefined,
            endDate: mongoTask.endDate ? new Date(mongoTask.endDate) : undefined
        };
    }

    // Metody fallback dla localStorage
    private static getTasksFromLocalStorage(): Task[] {
        const tasks = localStorage.getItem("tasks");
        return tasks ? JSON.parse(tasks) : [];
    }

    private static getTasksFromLocalStorageByProject(projectId: string): Task[] {
        // Implementacja wymaga pobrania stories dla projektu
        const StoryService = require('./story.service').default;
        const stories = StoryService.getStoriesByProjectId(projectId);
        const storyIds = stories.map((story: any) => story.id);
        
        const tasks = this.getTasksFromLocalStorage();
        return tasks.filter(task => storyIds.includes(task.storyId));
    }

    private static getTasksFromLocalStorageByStory(storyId: string): Task[] {
        const tasks = this.getTasksFromLocalStorage();
        return tasks.filter(task => task.storyId === storyId);
    }

    private static getTaskFromLocalStorage(id: string): Task | undefined {
        const tasks = this.getTasksFromLocalStorage();
        return tasks.find(t => t.id === id);
    }

    private static saveTaskToLocalStorage(task: Task): void {
        const tasks = this.getTasksFromLocalStorage();
        const existingIndex = tasks.findIndex(t => t.id === task.id);
        
        if (existingIndex >= 0) {
            tasks[existingIndex] = task;
        } else {
            tasks.push(task);
        }
        
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    private static deleteTaskFromLocalStorage(id: string): void {
        const tasks = this.getTasksFromLocalStorage();
        const filteredTasks = tasks.filter(t => t.id !== id);
        localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    }

    private static assignUserToTaskInLocalStorage(taskId: string, userId: string): void {
        const tasks = this.getTasksFromLocalStorage();
        const task = tasks.find(t => t.id === taskId);
        if (task && task.state === 'todo') {
            task.assignedUserId = userId;
            task.state = 'doing';
            task.startDate = new Date();
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }

    private static completeTaskInLocalStorage(taskId: string): void {
        const tasks = this.getTasksFromLocalStorage();
        const task = tasks.find(t => t.id === taskId);
        if (task && task.state === 'doing') {
            task.state = 'done';
            task.endDate = new Date();
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }
}

export default TaskService;