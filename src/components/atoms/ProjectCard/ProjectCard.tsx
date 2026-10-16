import Link from "next/link";
import Badge from "react-bootstrap/Badge";
import type { Project } from "../../pages/Showcase/projects";
import "./ProjectCard.scss";

const isExternal = (href: string) => /^https?:\/\//.test(href);

// The title link is stretched over the whole card (see ProjectCard.scss), so
// the card is clickable anywhere while the link's accessible name stays just
// the title instead of the card's entire content.
interface ProjectCardProps extends Project {
    // Cards nested under a section heading use h3 to keep the outline valid.
    headingLevel?: 2 | 3;
}

const ProjectCard = ({ title, description, href, preview, previewStill, previewAlt, pixelArt, tech, role, headingLevel = 2 }: ProjectCardProps) => {
    const external = isExternal(href);
    const Heading = headingLevel === 3 ? "h3" : "h2";

    return (
        <article className="project-card">
            <picture className={pixelArt ? "project-card__preview project-card__preview--pixel-art" : "project-card__preview"}>
                {previewStill && (
                    <source media="(prefers-reduced-motion: reduce)" srcSet={previewStill} />
                )}
                {/* Static export: next/image optimisation is not available. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt={previewAlt} loading="lazy" />
            </picture>
            <div className="project-card__body">
                <Heading className="project-card__title">
                    {external ? (
                        <a className="project-card__link" href={href} target="_blank" rel="noopener noreferrer">
                            {title}
                            <span className="visually-hidden"> (opens in a new tab)</span>
                        </a>
                    ) : (
                        <Link className="project-card__link" href={href}>
                            {title}
                        </Link>
                    )}
                </Heading>
                {role && <p className="project-card__role">{role}</p>}
                <p className="project-card__tech">
                    <span className="visually-hidden">Built with: </span>
                    {/* bg="" skips Badge's default bg-primary (an !important
                        background), so the site palette applies instead. */}
                    {tech.map((name) => (
                        <Badge key={name} bg="" className="project-card__badge">{name}</Badge>
                    ))}
                </p>
                <p className="project-card__description">{description}</p>
            </div>
        </article>
    );
};

export default ProjectCard;
