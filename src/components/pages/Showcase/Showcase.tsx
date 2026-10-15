import ProjectCard from "../../atoms/ProjectCard/ProjectCard";
import projects from "./projects";
import './Showcase.scss';

const Showcase = () => {
    return (
        <div className="showcase">
            <h1 className="showcase__title">Things I made</h1>
            <ul className="showcase__grid">
                {projects.map((project) => (
                    <li key={project.href}>
                        <ProjectCard {...project} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Showcase
