export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskState = 'todo' | 'doing' | 'done';

export interface Task {
    id: string;
    name: string;
    description: string;
    priority: TaskPriority;
    storyId: string;
    estimatedTime: number;
    state: TaskState;
    createdAt: Date;
    startDate?: Date;
    endDate?: Date;
    assignedUserId?: string;
}