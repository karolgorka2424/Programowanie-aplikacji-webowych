export interface Project {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ProjectId = string;
export type ProjectWithoutId = Omit<Project, '_id'>;