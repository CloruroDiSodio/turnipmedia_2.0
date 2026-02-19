import React from "react";
import {BiPlanet, BiGame, BiRocket, BiAtom} from 'react-icons/bi';
import './Resume.scss';

const Resume = () => {
    function calculateAge(birthDateString) {
        const today = new Date();
        const birthDate = new Date(birthDateString);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // If the current month is before the birth month, 
        // or if it's the same month but the current day is before the birth day,
        // the birthday hasn't happened yet this year.
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    return (
        <div className="resume">
            <p>
                <BiPlanet /> <b>Denise Moscon</b><br />
                <div className="resume__indent">
                    <span>{calculateAge("1994-06-24")} yo</span><br />
                    <span>Front-end developer</span><br />
                </div>
            </p>

            <p>
                <BiGame /> <b>Career</b><br />
                <div className="resume__indent">
                    <i>03/2025 - now</i><br />
                    <span>Truelayer (Milano, Italy)</span><br />
                    <span>Front-end development (React.js, Gatsby.js, company website)</span><br />
                    <br />
                    <i>03/2023 - 03/2025</i><br />
                    <span>Arduino (Torino, Italy)</span><br />
                    <span>Front-end development (React.js, Next.js, landing pages)</span><br />
                    <br />
                    <i>03/2021 - 03/2023</i><br />
                    <span>Vidiemme consulting (Milano, Italy)</span><br />
                    <span>Front-end development (React.js, React Native, landing pages)</span><br />
                    <span>Front-end mentoring</span><br />
                    <br />
                    <i>12/2019 - 03/2021</i><br />
                    <span>Skill srl (Verona, Italy)</span><br />
                    <span>Front-end development (React.js)</span><br />
                    <br />
                    <i>06/2019 - 12/2019</i><br />
                    <span>Happy Brain (Verona, Italy)</span><br />
                    <span>Front-end development (React.js, React Native, Wordpress)</span><br />
                    <br />
                </div>
            </p>
            <p>
                <BiAtom /> <b className="text-purple">Studies</b><br />
                <div className="resume__indent" >
                    <i>2016-2019</i><br />
                    <span>Scuola Internazionale di Comics (Padova, Italy)</span><br />
                    <span>Graphic and web design, web development</span><br />
                </div>
            </p>
            <p>
                <BiRocket /> <b>Skills</b><br />
                <div className="resume__indent">
                    <span>React.js, React Native, CRA</span><br />
                    <span>Next.js, Gatsby.js</span><br />
                    <span>Testing libraries (Playwright, Vitest)</span><br />
                    <span>Redux and such</span><br />
                    <span>HTML5 (Canvas, SVG), CSS3, SASS, SCSS, Javascript (ES6+)</span><br />
                    <span>Rest API</span><br />
                    <span>Bootstrap, GSAP, Jquery and more libraries</span><br />
                    <span>Git, npm, yarn, composer, parcel, webpack</span><br />
                    <span>CI/CD</span><br />
                    <span>Suite Adobe, Sketch, Affinity Design</span>
                </div>
            </p>
        </div>
    )
}

export default Resume
