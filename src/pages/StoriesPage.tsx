import { useState, useEffect } from 'react';
import { Story } from '../models/Story';
import StoryService from '../services/story.service';
import ActiveProjectService from '../services/activeProject.service';
import LocalStorageService from '../services/localStorage.service';
import { StoryForm } from '../components/StoryForm';
import { StoryList } from '../components/StoryList';
import { ProjectSelector } from '../components/ProjectSelector';

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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Historyjki
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Zarządzaj historyjkami użytkownika w projekcie
                    </p>
                </div>
            </div>
            
            <ProjectSelector onProjectChange={handleProjectChange} />
            
            {activeProjectId ? (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                            Projekt: {activeProjectName}
                        </h2>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {editingStory ? 'Edytuj historyjkę' : 'Dodaj nową historyjkę'}
                            </h3>
                        </div>
                        <div className="p-6">
                            <StoryForm
                                onSubmit={editingStory ? handleUpdateStory : handleAddStory}
                                initialStory={editingStory || undefined}
                                onCancel={editingStory ? () => setEditingStory(null) : undefined}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Lista historyjek
                        </h3>
                        <StoryList
                            stories={stories}
                            onEdit={setEditingStory}
                            onDelete={handleDeleteStory}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Wybierz projekt
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Wybierz projekt, aby zobaczyć historyjki
                    </p>
                </div>
            )}
        </div>
    );
};