import React from "react";
import {FiGithub, FiLinkedin, FiCodepen} from 'react-icons/fi';
import './Contacts.scss';

const Contacts = () => {
    return (
        <div className="contacts">
            <p className="contacts__name">Denise Moscon</p>
            <p>den.moscon@gmail.com</p>
            <p className="contacts__social">
                <a target="_blank" rel="noreferrer" href="https://github.com/CloruroDiSodio">
                    <FiGithub />
                </a>
                <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/denisemoscon/">
                    <FiLinkedin />
                </a>
                <a target="_blank" rel="noreferrer" href="https://codepen.io/pineappleSyrup/">
                    <FiCodepen />
                </a>
            </p>
        </div>
    )
}

export default Contacts
