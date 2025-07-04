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
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Brak historyjek w tym projekcie</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        filterState === 'all' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setFilterState('all')}
                >
                    Wszystkie ({stories.length})
                </button>
                <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        filterState === 'todo' 
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-400 dark:border-gray-500' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setFilterState('todo')}
                >
                    Do zrobienia ({getStateCount('todo')})
                </button>
                <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        filterState === 'doing' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setFilterState('doing')}
                >
                    W trakcie ({getStateCount('doing')})
                </button>
                <button 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        filterState === 'done' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setFilterState('done')}
                >
                    Zakończone ({getStateCount('done')})
                </button>
            </div>
            
            {/* Stories grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStories.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400">Brak historyjek w wybranej kategorii</p>
                    </div>
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