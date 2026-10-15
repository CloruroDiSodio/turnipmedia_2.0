import './HeaderMenu.scss';
import MenuLink from "../../atoms/MenuLink/MenuLink";

const HeaderMenu = () => {
    return (
        <nav className="header-menu" aria-label="Main">
            <MenuLink link="/" label="Me"/>
            <MenuLink link="/resume" label="What have I done with my life" />
            <MenuLink link="/showcase" label="Things I made" />
            <MenuLink link="/contacts" label="Where to find me (if you must!)" />
        </nav>
    )
}

export default HeaderMenu
