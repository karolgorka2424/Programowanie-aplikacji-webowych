import { useState } from 'react';
import { Story, StoryState } from '../models/Story';
import { StoryItem } from './StoryItem';

interface StoryListProps {
    stories: Story[];
    onEdit: (story: Story) => void;
    onDelete: (id: string) => void;
}

export const StoryList = ({ stories, onEdit, onDelete }: StoryListProps) => {
    const [filterState, setFilterState] = useState<StoryState | 'all'>('all');

    const filteredStories = filterState === 'all' 
        ? stories 
        : stories.filter(story => story.state === filterState);

    const getStateCount = (state: StoryState) => {
        return stories.filter(story => story.state === state).length;
    };

    if (stories.length === 0) {
        return <p>Brak historyjek w tym projekcie</p>;
    }

    return (
        <div className="story-list">
            <div className="story-filters">
                <button 
                    className={filterState === 'all' ? 'active' : ''}
                    onClick={() => setFilterState('all')}
                >
                    Wszystkie ({stories.length})
                </button>
                <button 
                    className={filterState === 'todo' ? 'active' : ''}
                    onClick={() => setFilterState('todo')}
                >
                    Do zrobienia ({getStateCount('todo')})
                </button>
                <button 
                    className={filterState === 'doing' ? 'active' : ''}
                    onClick={() => setFilterState('doing')}
                >
                    W trakcie ({getStateCount('doing')})
                </button>
                <button 
                    className={filterState === 'done' ? 'active' : ''}
                    onClick={() => setFilterState('done')}
                >
                    Zakończone ({getStateCount('done')})
                </button>
            </div>
            
            <div className="story-items">
                {filteredStories.length === 0 ? (
                    <p>Brak historyjek w wybranej kategorii</p>
                ) : (
                    filteredStories.map(story => (
                        <StoryItem
                            key={story.id}
                            story={story}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};