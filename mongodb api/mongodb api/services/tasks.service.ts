import { TaskWithoutId, Task, TaskId } from "../models/task.model";
import { dbService } from "./db.service";

class TasksService {
    private collectionName = 'tasks';

    getTasks() {
        return dbService.find<Task>({}, this.collectionName);
    }

    getTask(id: TaskId) {
        return dbService.findOne<Task>(id, this.collectionName);
    }

    async createTask(task: TaskWithoutId) {
        const taskWithTimestamps = {
            ...task,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return dbService.create(taskWithTimestamps, this.collectionName);
    }

    updateTask(id: string, task: Partial<TaskWithoutId>) {
        const taskWithTimestamp = {
            ...task,
            updatedAt: new Date()
        };
        return dbService.patch(id, taskWithTimestamp, this.collectionName);
    }

    replaceTask(id: string, task: TaskWithoutId) {
        const taskWithTimestamps = {
            ...task,
            updatedAt: new Date()
        };
        return dbService.replace(id, taskWithTimestamps, this.collectionName);
    }

    deleteTask(id: TaskId) {
        return dbService.delete(id, this.collectionName);
    }

    // Metody specyficzne dla Task
    async getTasksByStoryId(storyId: string) {
        const query = { storyId };
        return dbService.find<Task>(query, this.collectionName);
    }

    async getTasksByState(state: Task['state']) {
        const query = { state };
        return dbService.find<Task>(query, this.collectionName);
    }

    async getTasksByAssignedUser(assignedUserId: string) {
        const query = { assignedUserId };
        return dbService.find<Task>(query, this.collectionName);
    }

    async getTasksByProjectId(projectId: string) {
        // Najpierw pobierz wszystkie stories dla projektu
        const { storiesService } = await import('./stories.service');
        const stories = await storiesService.getStoriesByProjectId(projectId);
        const storyIds = stories.map((story: any) => story._id.toString());
        
        if (storyIds.length === 0) return [];
        
        const query = { storyId: { $in: storyIds } };
        return dbService.find<Task>(query, this.collectionName);
    }

    // Akcje na zadaniach
    async assignUserToTask(taskId: string, userId: string) {
        const updateData = {
            assignedUserId: userId,
            state: 'doing' as Task['state'],
            startDate: new Date(),
            updatedAt: new Date()
        };
        return dbService.patch(taskId, updateData, this.collectionName);
    }

    async completeTask(taskId: string) {
        const updateData = {
            state: 'done' as Task['state'],
            endDate: new Date(),
            updatedAt: new Date()
        };
        return dbService.patch(taskId, updateData, this.collectionName);
    }
}

export const tasksService = new TasksService();