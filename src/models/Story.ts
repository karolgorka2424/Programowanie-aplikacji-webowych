export type Priority = 'low' | 'medium' | 'high';
export type StoryState = 'todo' | 'doing' | 'done';

export interface Story {
    id: string;
    name: string;
    description: string;
    priority: Priority;
    projectId: string;
    createdAt: Date;
    state: StoryState;
    ownerId: string;
}