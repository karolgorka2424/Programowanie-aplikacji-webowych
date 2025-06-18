import { Story } from "../models/Story";

class StoryService {
    private static readonly STORIES_KEY = "stories";

    static saveStory(story: Story): void {
        const stories = this.getStories();
        const existingIndex = stories.findIndex(s => s.id === story.id);
        
        if (existingIndex >= 0) {
            stories[existingIndex] = story;
        } else {
            stories.push(story);
        }
        
        localStorage.setItem(this.STORIES_KEY, JSON.stringify(stories));
    }

    static getStories(): Story[] {
        const stories = localStorage.getItem(this.STORIES_KEY);
        return stories ? JSON.parse(stories) : [];
    }

    static getStoriesByProjectId(projectId: string): Story[] {
        return this.getStories().filter(story => story.projectId === projectId);
    }

    static getStoryById(id: string): Story | undefined {
        return this.getStories().find(story => story.id === id);
    }

    static deleteStory(id: string): void {
        const stories = this.getStories();
        const filteredStories = stories.filter(story => story.id !== id);
        localStorage.setItem(this.STORIES_KEY, JSON.stringify(filteredStories));
    }

    static getStoriesByState(projectId: string, state: Story['state']): Story[] {
        return this.getStoriesByProjectId(projectId).filter(story => story.state === state);
    }
}

export default StoryService;