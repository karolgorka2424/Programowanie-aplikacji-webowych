import { useState, useEffect } from 'react';
import { Story } from '../models/Story';
import StoryService from '../services/story.service.ts';
import ActiveProjectService from '../services/activeProject.service.ts';
import LocalStorageService from '../services/localStorage.service.ts';
import { StoryForm } from '../components/StoryForm';
import { StoryList } from '../components/StoryList';
import { ProjectSelector } from '../components/ProjectSelector';
import { UserInfo } from '../components/UserInfo';

export const StoriesPage = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [editingStory, setEditingStory] = useState<Story | null>(null);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeProjectName, setActiveProjectName] = useState<string>('');

    useEffect(() => {
        loadStories();
    }, [activeProjectId]);

    const loadStories = () => {
        const projectId = ActiveProjectService.getActiveProjectId();
        setActiveProjectId(projectId);
        
        if (projectId) {
            const project = LocalStorageService.getProjectById(projectId);
            setActiveProjectName(project?.name || '');
            
            const projectStories = StoryService.getStoriesByProjectId(projectId);
            setStories(projectStories);
        } else {
            setActiveProjectName('');
            setStories([]);
        }
    };

    const handleProjectChange = () => {
        loadStories();
    };

    const handleAddStory = (storyData: Omit<Story, 'id'>) => {
        const newStory: Story = {
            ...storyData,
            id: crypto.randomUUID()
        };
        
        StoryService.saveStory(newStory);
        loadStories();
    };

    const handleUpdateStory = (storyData: Omit<Story, 'id'>) => {
        if (!editingStory) return;
        
        const updatedStory: Story = {
            ...storyData,
            id: editingStory.id
        };
        
        StoryService.saveStory(updatedStory);
        setEditingStory(null);
        loadStories();
    };

    const handleDeleteStory = (id: string) => {
        if (confirm('Czy na pewno chcesz usunąć tę historyjkę?')) {
            StoryService.deleteStory(id);
            loadStories();
        }
    };

    return (
        <div className="stories-page">
            <div className="page-header">
                <h1>Historyjki</h1>
                <UserInfo />
            </div>
            
            <ProjectSelector onProjectChange={handleProjectChange} />
            
            {activeProjectId ? (
                <>
                    <h2>Projekt: {activeProjectName}</h2>
                    
                    <div className="story-form-section">
                        <h3>{editingStory ? 'Edytuj historyjkę' : 'Dodaj nową historyjkę'}</h3>
                        <StoryForm
                            onSubmit={editingStory ? handleUpdateStory : handleAddStory}
                            initialStory={editingStory || undefined}
                            onCancel={editingStory ? () => setEditingStory(null) : undefined}
                        />
                    </div>
                    
                    <div className="story-list-section">
                        <h3>Lista historyjek</h3>
                        <StoryList
                            stories={stories}
                            onEdit={setEditingStory}
                            onDelete={handleDeleteStory}
                        />
                    </div>
                </>
            ) : (
                <p className="no-project-selected">
                    Wybierz projekt, aby zobaczyć historyjki
                </p>
            )}
        </div>
    );
};