import ProjectCard from "../../atoms/ProjectCard/ProjectCard";
import projects, { workProjects } from "./projects";
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

            <section className="showcase__section" aria-labelledby="worked-on">
                <h2 id="worked-on" className="showcase__title">Things I worked on</h2>
                <p className="showcase__intro">
                    Sites I helped build as part of a team at the companies I worked for.
                </p>
                <ul className="showcase__grid">
                    {workProjects.map((project) => (
                        <li key={project.href}>
                            <ProjectCard {...project} headingLevel={3} />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

export default Showcase
