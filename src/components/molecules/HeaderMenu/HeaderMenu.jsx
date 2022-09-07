import React from "react";
import './HeaderMenu.scss';
import MenuLink from "../../atoms/MenuLink/MenuLink";
import {NavLink} from "react-router-dom";

const HeaderMenu = () => {
    return (
        <div className="header-menu">
            <MenuLink link="/" label="Me"/>
            <MenuLink link="/resume" label="What have I done with my life" />
            <MenuLink link="/contacts" label="Where to find me (if you must!)" />
            <NavLink
                style={{display: "none"}}
                to={'/appetta'}
            >
                appetta
            </NavLink>
        </div>
    )
}

export default HeaderMenu
