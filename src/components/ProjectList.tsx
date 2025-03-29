import { Project } from "../models/Project";
import { ProjectItem } from "./ProjectItem";
interface ProjectListProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}
export const ProjectList = ({ projects, onEdit, onDelete }: ProjectListProps) => {
    if (projects.length === 0) {
        return <p>No projects available</p>;
    }
    return (
        <div className="project-list">
            {projects.map((project) => (
                <ProjectItem
                    key={project.id}
                    project={project}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}