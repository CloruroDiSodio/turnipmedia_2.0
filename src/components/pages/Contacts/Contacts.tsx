import {FiGithub, FiLinkedin, FiCodepen, FiMail, FiArrowUpRight} from 'react-icons/fi';
import CopyButton from '../../atoms/CopyButton/CopyButton';
import LocalTime from '../../atoms/LocalTime/LocalTime';
import './Contacts.scss';

const EMAIL = "den.moscon@gmail.com";

const socials = [
    {label: "GitHub", handle: "@CloruroDiSodio", blurb: "Code and side projects", href: "https://github.com/CloruroDiSodio", Icon: FiGithub},
    {label: "LinkedIn", handle: "in/denisemoscon", blurb: "Where I've worked", href: "https://www.linkedin.com/in/denisemoscon/", Icon: FiLinkedin},
    {label: "CodePen", handle: "@pineappleSyrup", blurb: "Small frontend experiments", href: "https://codepen.io/pineappleSyrup/", Icon: FiCodepen},
];

const Contacts = () => {
    return (
        <div className="contacts">
            <header className="contacts__header">
                <h1 className="contacts__title">Say hi!</h1>
                <p className="contacts__intro">
                    I&apos;m Denise Moscon. Got a project, a question or a good book to recommend? My inbox is open.
                </p>
                <LocalTime />
            </header>

            <section className="contacts__mail" aria-labelledby="contacts-mail-title">
                <FiMail className="contacts__mail-icon" aria-hidden="true" focusable="false" />
                <h2 id="contacts-mail-title" className="contacts__mail-title">Send me an email</h2>
                <p className="contacts__mail-address">
                    <a className="contacts__email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </p>
                <CopyButton text={EMAIL} label="Copy address" />
            </section>

            <section aria-labelledby="contacts-social-title">
                <h2 id="contacts-social-title" className="contacts__subtitle">Or find me here</h2>
                <ul className="contacts__social">
                    {socials.map(({label, handle, blurb, href, Icon}) => (
                        <li key={label}>
                            <a
                                className="contacts__social-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                href={href}
                            >
                                <Icon className="contacts__social-icon" aria-hidden="true" focusable="false" />
                                <span className="contacts__social-text">
                                    <span className="contacts__social-label">{label}</span>
                                    <span className="contacts__social-handle">{handle}</span>
                                    <span className="contacts__social-blurb">{blurb}</span>
                                </span>
                                <FiArrowUpRight className="contacts__social-arrow" aria-hidden="true" focusable="false" />
                                <span className="visually-hidden"> (opens in a new tab)</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

export default Contacts
