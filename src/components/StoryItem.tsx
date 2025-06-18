import { Story } from '../models/Story';

interface StoryItemProps {
    story: Story;
    onEdit: (story: Story) => void;
    onDelete: (id: string) => void;
}

export const StoryItem = ({ story, onEdit, onDelete }: StoryItemProps) => {
    const getPriorityClass = (priority: Story['priority']) => {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return '';
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
        <div className={`story-item ${getPriorityClass(story.priority)}`}>
            <div className="story-header">
                <h4>{story.name}</h4>
                <span className={`story-state state-${story.state}`}>
                    {getStateLabel(story.state)}
                </span>
            </div>
            <p className="story-description">{story.description}</p>
            <div className="story-meta">
                <span className="story-priority">
                    Priorytet: {getPriorityLabel(story.priority)}
                </span>
                <span className="story-date">
                    Utworzono: {new Date(story.createdAt).toLocaleDateString('pl-PL')}
                </span>
            </div>
            <div className="story-actions">
                <button onClick={() => onEdit(story)}>Edytuj</button>
                <button onClick={() => onDelete(story.id)}>Usuń</button>
            </div>
        </div>
    );
};