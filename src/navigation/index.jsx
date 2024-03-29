import React from 'react';
import {Route, Routes} from "react-router-dom";
import Home from "../components/pages/Home/Home";
import Resume from "../components/pages/Resume/Resume";
import Contacts from "../components/pages/Contacts/Contacts";
import Appetta from "../components/pages/Appetta/Appetta";
import Library from "../components/pages/Library/Library";

const Navigator = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="resume" element={<Resume />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="appetta" element={<Appetta />} />
            <Route path="library" element={<Library />} />
        </Routes>
    );
}

export default Navigator;
