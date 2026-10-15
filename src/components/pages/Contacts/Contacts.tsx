import {FiGithub, FiLinkedin, FiCodepen} from 'react-icons/fi';
import './Contacts.scss';

// Icon-only links: the aria-label is their accessible name (and warns that
// they open in a new tab); the icons themselves are decorative.
const socials = [
    {label: "GitHub", href: "https://github.com/CloruroDiSodio", Icon: FiGithub},
    {label: "LinkedIn", href: "https://www.linkedin.com/in/denisemoscon/", Icon: FiLinkedin},
    {label: "CodePen", href: "https://codepen.io/pineappleSyrup/", Icon: FiCodepen},
];

const Contacts = () => {
    return (
        <div className="contacts">
            <h1 className="contacts__name">Denise Moscon</h1>
            <p><a className="contacts__email" href="mailto:den.moscon@gmail.com">den.moscon@gmail.com</a></p>
            <p className="contacts__social">
                {socials.map(({label, href, Icon}) => (
                    <a
                        key={label}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={href}
                        aria-label={`${label} (opens in a new tab)`}
                    >
                        <Icon aria-hidden="true" focusable="false" />
                    </a>
                ))}
            </p>
        </div>
    )
}

export default Contacts
