import React from "react";
import {NavLink} from "react-router-dom";
import './MenuLink.scss';

const MenuLink = ({link, label}) => {
    return (
        <NavLink
            className={({ isActive }) => isActive ? "menu-link menu-link--active" : "menu-link"}
            to={link}
        >
            {label}
        </NavLink>
    )
}

export default MenuLink
