import { Story } from '../models/Story';

interface StoryItemProps {
    story: Story;
    onEdit: (story: Story) => void;
    onDelete: (id: string) => void;
}

export const StoryItem = ({ story, onEdit, onDelete }: StoryItemProps) => {
    const getPriorityBorderClass = (priority: Story['priority']) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 dark:border-l-red-400';
            case 'medium': return 'border-l-yellow-500 dark:border-l-yellow-400';
            case 'low': return 'border-l-green-500 dark:border-l-green-400';
            default: return 'border-l-gray-300 dark:border-l-gray-600';
        }
    };

    const getStateClass = (state: Story['state']) => {
        switch (state) {
            case 'todo': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
            case 'doing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
            case 'done': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    const getStateLabel = (state: Story['state']) => {
        switch (state) {
            case 'todo': return 'Do zrobienia';
            case 'doing': return 'W trakcie';
            case 'done': return 'Zakończone';
            default: return state;
        }
    };

    const getPriorityLabel = (priority: Story['priority']) => {
        switch (priority) {
            case 'high': return 'Wysoki';
            case 'medium': return 'Średni';
            case 'low': return 'Niski';
            default: return priority;
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 ${getPriorityBorderClass(story.priority)}`}>
            <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{story.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStateClass(story.state)}`}>
                    {getStateLabel(story.state)}
                </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{story.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>
                    Priorytet: <span className="font-medium">{getPriorityLabel(story.priority)}</span>
                </span>
                <span>
                    Utworzono: {new Date(story.createdAt).toLocaleDateString('pl-PL')}
                </span>
            </div>
            <div className="flex justify-end space-x-2">
                <button 
                    onClick={() => onEdit(story)}
                    className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors duration-200"
                >
                    Edytuj
                </button>
                <button 
                    onClick={() => onDelete(story.id)}
                    className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                >
                    Usuń
                </button>
            </div>
        </div>
    );
};