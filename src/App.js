import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import Resume from "./components/pages/Resume/Resume";
import Contacts from "./components/pages/Contacts/Contacts";
import HeaderMenu from "./components/molecules/HeaderMenu/HeaderMenu";
import ParticlesBg from "./components/atoms/ParticlesBg/Particles";

function App() {
  return (
    <div className="App">
        <ParticlesBg />
        <HeaderMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="resume" element={<Resume />} />
          <Route path="contacts" element={<Contacts />} />
        </Routes>
    </div>
  );
}

export default App;
