import { Project } from "../models/Project";

interface ProjectItemProps {
    project: Project;
    onDelete: (id: string) => void;
    onEdit: (project: Project) => void;
}
export const ProjectItem = ({ project, onDelete, onEdit }: ProjectItemProps) => {
    return (
        <div className="project-item">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <button onClick={() => onEdit(project)}>Edit</button>
            <button onClick={() => onDelete(project.id)}>Delete</button>
            </div>
        );
    };