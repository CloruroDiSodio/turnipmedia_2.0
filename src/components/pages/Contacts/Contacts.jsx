import React from "react";
import {FiGithub, FiLinkedin, FiCodepen} from 'react-icons/fi';

const Contacts = () => {
    return (
        <div>
            <p>Denise Moscon</p>
            <p>den.moscon@gmail.com</p>
            <p>
                <a target="_blank" href="https://github.com/CloruroDiSodio">
                    <FiGithub />
                </a>
                <a target="_blank" href="https://www.linkedin.com/in/denisemoscon/">
                    <FiLinkedin />
                </a>
                <a target="_blank" href="https://codepen.io/pineappleSyrup/">
                    <FiCodepen />
                </a>
            </p>
        </div>
    )
}

export default Contacts
