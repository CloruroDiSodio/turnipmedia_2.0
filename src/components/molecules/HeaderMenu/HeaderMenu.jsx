import React from "react";
import './HeaderMenu.scss';
import MenuLink from "../../atoms/MenuLink/MenuLink";

const HeaderMenu = () => {
    return (
        <div className="header-menu">
            <MenuLink link="/" label="Me"/>
            <MenuLink link="/resume" label="What have I done with my life" />
            <MenuLink link="/contacts" label="Where to find me (if you must!)" />
        </div>
    )
}

export default HeaderMenu
