import { Story } from "../models/Story";
import MongoDBService from "./mongodb.service";

class StoryService {
    private static stories: Story[] = [];
    private static useLocalStorage = false;

    static async getStories(): Promise<Story[]> {
        try {
            if (this.useLocalStorage) {
                return this.getStoriesFromLocalStorage();
            }
            const stories = await MongoDBService.getStories();
            this.stories = stories.map(this.transformMongoStory);
            return this.stories;
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.getStoriesFromLocalStorage();
        }
    }

    static async getStoriesByProjectId(projectId: string): Promise<Story[]> {
        try {
            if (this.useLocalStorage) {
                return this.getStoriesFromLocalStorageByProject(projectId);
            }
            const stories = await MongoDBService.getStoriesByProject(projectId);
            return stories.map(this.transformMongoStory);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.getStoriesFromLocalStorageByProject(projectId);
        }
    }

    static async getStoryById(id: string): Promise<Story | undefined> {
        try {
            if (this.useLocalStorage) {
                return this.getStoryFromLocalStorage(id);
            }
            const story = await MongoDBService.getStory(id);
            return story ? this.transformMongoStory(story) : undefined;
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            return this.getStoryFromLocalStorage(id);
        }
    }

    static async saveStory(story: Story): Promise<void> {
        try {
            if (this.useLocalStorage) {
                return this.saveStoryToLocalStorage(story);
            }

            const storyData = {
                name: story.name,
                description: story.description,
                priority: story.priority,
                projectId: story.projectId,
                state: story.state,
                ownerId: story.ownerId
            };

            if (this.stories.find(s => s.id === story.id)) {
                await MongoDBService.updateStory(story.id, storyData);
            } else {
                const result = await MongoDBService.createStory(storyData);
                story.id = result.id;
            }

            const existingIndex = this.stories.findIndex(s => s.id === story.id);
            if (existingIndex >= 0) {
                this.stories[existingIndex] = story;
            } else {
                this.stories.push(story);
            }
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.saveStoryToLocalStorage(story);
        }
    }

    static async deleteStory(id: string): Promise<void> {
        try {
            if (this.useLocalStorage) {
                return this.deleteStoryFromLocalStorage(id);
            }
            await MongoDBService.deleteStory(id);
            this.stories = this.stories.filter(s => s.id !== id);
        } catch (error) {
            console.warn('Błąd MongoDB, używam localStorage jako fallback');
            this.useLocalStorage = true;
            return this.deleteStoryFromLocalStorage(id);
        }
    }

    static getStoriesByState(projectId: string, state: Story['state']): Story[] {
        return this.stories.filter(story => 
            story.projectId === projectId && story.state === state
        );
    }

    // Metody pomocnicze
    private static transformMongoStory(mongoStory: any): Story {
        return {
            id: mongoStory._id.toString(),
            name: mongoStory.name,
            description: mongoStory.description,
            priority: mongoStory.priority,
            projectId: mongoStory.projectId,
            createdAt: new Date(mongoStory.createdAt),
            state: mongoStory.state,
            ownerId: mongoStory.ownerId
        };
    }

    // Metody fallback dla localStorage
    private static getStoriesFromLocalStorage(): Story[] {
        const stories = localStorage.getItem("stories");
        return stories ? JSON.parse(stories) : [];
    }

    private static getStoriesFromLocalStorageByProject(projectId: string): Story[] {
        const stories = this.getStoriesFromLocalStorage();
        return stories.filter(story => story.projectId === projectId);
    }

    private static getStoryFromLocalStorage(id: string): Story | undefined {
        const stories = this.getStoriesFromLocalStorage();
        return stories.find(s => s.id === id);
    }

    private static saveStoryToLocalStorage(story: Story): void {
        const stories = this.getStoriesFromLocalStorage();
        const existingIndex = stories.findIndex(s => s.id === story.id);
        
        if (existingIndex >= 0) {
            stories[existingIndex] = story;
        } else {
            stories.push(story);
        }
        
        localStorage.setItem("stories", JSON.stringify(stories));
    }

    private static deleteStoryFromLocalStorage(id: string): void {
        const stories = this.getStoriesFromLocalStorage();
        const filteredStories = stories.filter(s => s.id !== id);
        localStorage.setItem("stories", JSON.stringify(filteredStories));
    }
}

export default StoryService;