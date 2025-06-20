import { StoryWithoutId, Story, StoryId } from "../models/story.model";
import { dbService } from "./db.service";

class StoriesService {
    private collectionName = 'stories';

    getStories() {
        return dbService.find<Story>({}, this.collectionName);
    }

    getStory(id: StoryId) {
        return dbService.findOne<Story>(id, this.collectionName);
    }

    async createStory(story: StoryWithoutId) {
        const storyWithTimestamps = {
            ...story,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return dbService.create(storyWithTimestamps, this.collectionName);
    }

    updateStory(id: string, story: Partial<StoryWithoutId>) {
        const storyWithTimestamp = {
            ...story,
            updatedAt: new Date()
        };
        return dbService.patch(id, storyWithTimestamp, this.collectionName);
    }

    replaceStory(id: string, story: StoryWithoutId) {
        const storyWithTimestamps = {
            ...story,
            updatedAt: new Date()
        };
        return dbService.replace(id, storyWithTimestamps, this.collectionName);
    }

    deleteStory(id: StoryId) {
        return dbService.delete(id, this.collectionName);
    }

    // Metody specyficzne dla Story
    async getStoriesByProjectId(projectId: string) {
        const query = { projectId };
        return dbService.find<Story>(query, this.collectionName);
    }

    async getStoriesByState(state: Story['state']) {
        const query = { state };
        return dbService.find<Story>(query, this.collectionName);
    }

    async getStoriesByOwner(ownerId: string) {
        const query = { ownerId };
        return dbService.find<Story>(query, this.collectionName);
    }

    async getStoriesByProjectAndState(projectId: string, state: Story['state']) {
        const query = { projectId, state };
        return dbService.find<Story>(query, this.collectionName);
    }
}

export const storiesService = new StoriesService();