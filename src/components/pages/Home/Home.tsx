import { SITE_URL } from "../../../app/seo";
import './Home.scss';

// schema.org Person data so search engines can connect this site with the
// same person's profiles elsewhere.
const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Denise Moscon",
    jobTitle: "Front-end Developer",
    url: SITE_URL,
    sameAs: [
        "https://github.com/CloruroDiSodio",
        "https://www.linkedin.com/in/denisemoscon/",
        "https://codepen.io/pineappleSyrup/",
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
            <h1 className="home__hi">Hi! :)</h1>
            <p className="h4">I'm Denise, nice to meet you!</p>
            <span>I write code.</span><br />
            <span>I read books.</span><br />
            <span>I do stuff.</span>
        </div>
    )
}

export default Home