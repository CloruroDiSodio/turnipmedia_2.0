import TextLink from "../../atoms/TextLink/TextLink";
import { SITE_URL } from "../../../app/seo";
import Portrait from "../../atoms/Portrait/Portrait";
import './Home.scss';

// schema.org Person data so search engines can connect this site with the
// same person's profiles elsewhere.
const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Denise Moscon",
    jobTitle: "Senior Frontend Engineer",
    url: SITE_URL,
    sameAs: [
        "https://github.com/CloruroDiSodio",
        "https://www.linkedin.com/in/denisemoscon/",
        "https://codepen.io/pineappleSyrup/",
        "https://ko-fi.com/turnipmedia",
    ],
};

const Home = () => {
    return (
        <div className="home" >
            <script
                type="application/ld+json"
                // Static data, but escape "<" anyway so the JSON can never
                // close the <script> element early.
                dangerouslySetInnerHTML={{__html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c")}}
            />
            <div className="home__intro">
                <h1 className="home__hi">Hi! :)</h1>
                <p className="h4">I'm Denise, nice to meet you!</p>
                <p className="home__role">Senior frontend engineer, based near Milan.</p>
                <ul className="home__facts">
                    <li>I write code.</li>
                    <li>I read books.</li>
                    <li>I drink tea.</li>
                    <li>I do stuff.</li>
                </ul>
                <nav className="home__links" aria-label="Get to know me">
                    <TextLink variant="action" href="/showcase">See my work</TextLink>
                    <TextLink variant="action" href="/resume">Read my resume</TextLink>
                    <TextLink variant="action" href="/contacts">Say hi</TextLink>
                </nav>
            </div>
            <Portrait />
        </div>
    )
}

export default Home