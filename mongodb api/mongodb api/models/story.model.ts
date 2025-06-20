export interface Story {
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    state: 'todo' | 'doing' | 'done';
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type StoryId = string;
export type StoryWithoutId = Omit<Story, '_id'>;
