import {useLocation} from "react-router-dom";
import HeaderMenu from "./components/molecules/HeaderMenu/HeaderMenu";
import ParticlesBg from "./components/atoms/ParticlesBg/Particles";
import Navigator from "./navigation";
import './App.css';

function App() {
    const {pathname} = useLocation();
    return (
        <div className="App">
            {(pathname !== '/appetta' && pathname !== '/library') ?
                (<>
                    <ParticlesBg />
                    <HeaderMenu />
                </>) :
                <></>}
            <Navigator />
        </div>
);
}

export default App;
