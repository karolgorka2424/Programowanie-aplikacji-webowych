import { Project } from "../models/Project";
import { ProjectItem } from "./ProjectItem";

interface ProjectListProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

export const ProjectList = ({ projects, onEdit, onDelete }: ProjectListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
};