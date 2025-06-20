import { useState, useEffect } from 'react';
import { Story } from '../models/Story';
import StoryService from '../services/story.service'; // Zaktualizowany serwis
import ActiveProjectService from '../services/activeProject.service';
import ProjectService from '../services/project.service'; // Zaktualizowany serwis
import { StoryForm } from '../components/StoryForm';
import { StoryList } from '../components/StoryList';
import { ProjectSelector } from '../components/ProjectSelector';
import { UserInfo } from '../components/UserInfo';

export const StoriesPage = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [editingStory, setEditingStory] = useState<Story | null>(null);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeProjectName, setActiveProjectName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStories();
    }, [activeProjectId]);

    const loadStories = async () => {
        setLoading(true);
        setError(null);
        try {
            const projectId = ActiveProjectService.getActiveProjectId();
            setActiveProjectId(projectId);
            
            if (projectId) {
                const project = await ProjectService.getProjectById(projectId);
                setActiveProjectName(project?.name || '');
                
                const projectStories = await StoryService.getStoriesByProjectId(projectId);
                setStories(projectStories);
            } else {
                setActiveProjectName('');
                setStories([]);
            }
        } catch (err) {
            setError('Błąd podczas ładowania historyjek');
            console.error('Error loading stories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectChange = () => {
        loadStories();
    };

    const handleAddStory = async (storyData: Omit<Story, 'id'>) => {
        setLoading(true);
        try {
            const newStory: Story = {
                ...storyData,
                id: crypto.randomUUID() // Tymczasowe ID
            };
            
            await StoryService.saveStory(newStory);
            await loadStories();
        } catch (err) {
            setError('Błąd podczas dodawania historyjki');
            console.error('Error adding story:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStory = async (storyData: Omit<Story, 'id'>) => {
        if (!editingStory) return;
        
        setLoading(true);
        try {
            const updatedStory: Story = {
                ...storyData,
                id: editingStory.id
            };
            
            await StoryService.saveStory(updatedStory);
            setEditingStory(null);
            await loadStories();
        } catch (err) {
            setError('Błąd podczas aktualizacji historyjki');
            console.error('Error updating story:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStory = async (id: string) => {
        if (!confirm('Czy na pewno chcesz usunąć tę historyjkę?')) return;
        
        setLoading(true);
        try {
            await StoryService.deleteStory(id);
            await loadStories();
        } catch (err) {
            setError('Błąd podczas usuwania historyjki');
            console.error('Error deleting story:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="stories-page">
            <div className="page-header">
                <h1>Historyjki</h1>
                <UserInfo />
            </div>
            
            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{error}</span>
                    <button 
                        onClick={() => setError(null)}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        ×
                    </button>
                </div>
            )}
            
            <ProjectSelector onProjectChange={handleProjectChange} />
            
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-2 text-gray-600">Ładowanie...</p>
                </div>
            )}
            
            {activeProjectId && !loading ? (
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
                    
                    <div className="stories-section">
                        <h3>Lista historyjek</h3>
                        <StoryList
                            stories={stories}
                            onEdit={setEditingStory}
                            onDelete={handleDeleteStory}
                        />
                    </div>
                </>
            ) : !loading && (
                <div className="no-project-selected">
                    <p>Wybierz projekt, aby zobaczyć historyjki</p>
                </div>
            )}
        </div>
    );
};