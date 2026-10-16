import type { ReactNode } from 'react';
import Badge from 'react-bootstrap/Badge';
import {
    BiPlanet, BiGame, BiRocket, BiAtom, BiMap, BiCodeAlt, BiLayer,
    BiBot, BiPalette, BiWorld,
} from 'react-icons/bi';
import './Resume.scss';

type Job = {
    period: string;
    role: string;
    company: string;
    location: string;
    highlight: string;
    tech: string[];
};

const career: Job[] = [
    { period: '2025 - now', role: 'Web Developer', company: 'Truelayer', location: 'Milano, Italy', highlight: 'Led the website redesign and migration to Next.js and Storyblok; owns the internal component library', tech: ['React.js', 'Next.js', 'Gatsby', 'Storyblok', 'Design system'] },
    { period: '2023 - 2025', role: 'Software Engineer', company: 'Arduino', location: 'Torino, Italy', highlight: 'Institutional web apps and subscription management', tech: ['Next.js', 'DatoCMS', 'Component library'] },
    { period: '2021 - 2023', role: 'Frontend Developer & Mentor', company: 'Vidiemme Consulting', location: 'Milano, Italy', highlight: 'Team lead on a luxury e-commerce; mentored juniors with code reviews and pair programming', tech: ['React.js', 'Next.js', 'Storyblok', 'React Native'] },
    { period: '2019 - 2021', role: 'Frontend Developer', company: 'Skill Srl', location: 'Verona, Italy', highlight: 'Management portals, REST API contracts', tech: ['React.js', 'REST API'] },
    { period: '2019', role: 'Frontend Developer', company: 'Happy Brain', location: 'Verona, Italy', highlight: 'Responsive websites and mobile apps', tech: ['React.js', 'TypeScript', 'React Native'] },
];

const skills: { label: string; icon: ReactNode; items: string[] }[] = [
    { label: 'Frontend engineering', icon: <BiCodeAlt aria-hidden="true" />, items: ['React.js', 'Next.js', 'TypeScript', 'Gatsby', 'HTML5', 'CSS3/SASS'] },
    { label: 'Architecture & CMS', icon: <BiLayer aria-hidden="true" />, items: ['Storyblok', 'DatoCMS', 'Design systems', 'Micro-frontends', 'Swagger/OpenAPI'] },
    { label: 'Developer experience & AI', icon: <BiBot aria-hidden="true" />, items: ['Claude Code', 'Figma MCP', 'Git/Gitflow', 'CI/CD', 'Toolchain optimization'] },
    { label: 'Design & collaboration', icon: <BiPalette aria-hidden="true" />, items: ['Figma', 'Sketch', 'Photoshop', 'Agile/Scrum', 'Mentorship', 'Code reviews'] },
];

// Full years elapsed since a date (also used for the age).
const yearsSince = (dateString: string): number => {
    const today = new Date();
    const date = new Date(dateString);

    let years = today.getFullYear() - date.getFullYear();
    const monthDifference = today.getMonth() - date.getMonth();

    // If the current month is before the anniversary month, or if it's the
    // same month but the day hasn't come yet, the year isn't complete.
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
        years--;
    }

    return years;
}

// bg="" skips Badge's default bg-primary (an !important background), so the
// site palette applies instead (same trick as ProjectCard).
const Tag = ({ children }: { children: ReactNode }) => (
    <Badge bg="" className="resume__badge">{children}</Badge>
);

const Resume = () => {
    return (
        <div className="resume">
            <h1 id="resume-title" className="visually-hidden">Resume</h1>

            <section className="resume-card resume-card--profile" aria-labelledby="resume-profile">
                <h2 className="resume-card__header" id="resume-profile">
                    <BiPlanet aria-hidden="true" /> Denise Moscon
                </h2>
                <div className="resume-card__body">
                    <p className="resume__role">Senior Frontend Engineer</p>
                    <p className="resume__location">
                        <BiMap aria-hidden="true" /> Desio (MB), Italy
                    </p>
                    <p className="resume__summary">
                        Fast web apps, scalable design systems and Jamstack
                        architectures. I lead migrations, bridge Design and
                        Engineering, and mentor frontend teams.
                    </p>
                    <dl className="resume__stats">
                        <div>
                            <dt>Age</dt>
                            <dd>{yearsSince('1994-06-24')}</dd>
                        </div>
                        <div>
                            <dt>Years coding</dt>
                            <dd>{yearsSince('2019-06-01')}+</dd>
                        </div>
                    </dl>
                </div>
            </section>

            <section className="resume-card resume-card--career" aria-labelledby="resume-career">
                <h2 className="resume-card__header" id="resume-career">
                    <BiGame aria-hidden="true" /> Career
                </h2>
                <ol className="resume-card__body resume__timeline">
                    {career.map((job, index) => (
                        <li
                            key={job.company}
                            className={index === 0 ? 'resume__job resume__job--current' : 'resume__job'}
                        >
                            <p className="resume__period">{job.period} &middot; {job.role}</p>
                            <h3 className="resume__company">
                                {job.company}
                                <span className="resume__location">
                                    <BiMap aria-hidden="true" /> {job.location}
                                </span>
                            </h3>
                            <p className="resume__focus">{job.highlight}</p>
                            <p className="resume__tags">
                                <span className="visually-hidden">Built with: </span>
                                {job.tech.map((name) => <Tag key={name}>{name}</Tag>)}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="resume-card resume-card--studies" aria-labelledby="resume-studies">
                <h2 className="resume-card__header" id="resume-studies">
                    <BiAtom aria-hidden="true" /> Studies
                </h2>
                <div className="resume-card__body">
                    <p className="resume__period">2016 - 2019 &middot; Three-year diploma</p>
                    <h3 className="resume__company">
                        Scuola Internazionale di Comics
                        <span className="resume__location">
                            <BiMap aria-hidden="true" /> Padova, Italy
                        </span>
                    </h3>
                    <p className="resume__focus">Graphics and web design</p>
                    <h3 className="resume__subheading">
                        <BiWorld aria-hidden="true" /> Languages
                    </h3>
                    <p className="resume__tags">
                        <Tag>Italian &middot; native</Tag>
                        <Tag>English &middot; professional</Tag>
                    </p>
                </div>
            </section>

            <section className="resume-card resume-card--skills" aria-labelledby="resume-skills">
                <h2 className="resume-card__header" id="resume-skills">
                    <BiRocket aria-hidden="true" /> Skills
                </h2>
                <dl className="resume-card__body resume__skills">
                    {skills.map((group) => (
                        <div key={group.label} className="resume__skill-group">
                            <dt>{group.icon} {group.label}</dt>
                            <dd className="resume__tags">
                                {group.items.map((name) => <Tag key={name}>{name}</Tag>)}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
        </div>
    )
}

export default Resume
