import { Task, TaskState } from "../models/Task";

class TaskService {
    private static readonly TASKS_KEY = "tasks";

    static saveTask(task: Task): void {
        const tasks = this.getTasks();
        const existingIndex = tasks.findIndex(t => t.id === task.id);
        
        if (existingIndex >= 0) {
            tasks[existingIndex] = task;
        } else {
            tasks.push(task);
        }
        
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    }

    static getTasks(): Task[] {
        const tasks = localStorage.getItem(this.TASKS_KEY);
        return tasks ? JSON.parse(tasks) : [];
    }

    static getTasksByStoryId(storyId: string): Task[] {
        return this.getTasks().filter(task => task.storyId === storyId);
    }

    static getTaskById(id: string): Task | undefined {
        return this.getTasks().find(task => task.id === id);
    }

    static deleteTask(id: string): void {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem(this.TASKS_KEY, JSON.stringify(filteredTasks));
    }

    static getTasksByState(state: TaskState): Task[] {
        return this.getTasks().filter(task => task.state === state);
    }

    static getTasksByUserId(userId: string): Task[] {
        return this.getTasks().filter(task => task.assignedUserId === userId);
    }

    static assignUserToTask(taskId: string, userId: string): void {
        const task = this.getTaskById(taskId);
        if (task && task.state === 'todo') {
            task.assignedUserId = userId;
            task.state = 'doing';
            task.startDate = new Date();
            this.saveTask(task);
        }
    }

    static completeTask(taskId: string): void {
        const task = this.getTaskById(taskId);
        if (task && task.state === 'doing') {
            task.state = 'done';
            task.endDate = new Date();
            this.saveTask(task);
        }
    }

    static getTasksByProjectId(projectId: string): Task[] {
        const StoryService = require('./story.service').default;
        const projectStories = StoryService.getStoriesByProjectId(projectId);
        const storyIds = projectStories.map((story: { id: string }) => story.id);
        
        return this.getTasks().filter(task => storyIds.includes(task.storyId));
    }
}

export default TaskService;