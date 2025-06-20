export interface Task {
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    storyId: string;
    estimatedTime: number;
    state: 'todo' | 'doing' | 'done';
    assignedUserId?: string;
    createdAt: Date;
    updatedAt: Date;
    startDate?: Date;
    endDate?: Date;
}

export type TaskId = string;
export type TaskWithoutId = Omit<Task, '_id'>;