import React, {useEffect, useState} from "react";
import {Col, Container, Row, Button, Toast, ToastContainer} from "react-bootstrap";
import { GiWinterHat } from "react-icons/gi";
import {useSearchParams} from "react-router-dom";
import AudioButton from "../../atoms/AudioButton/AudioButton";
import {sounds, specials} from "./sounds";
import './appetta.scss'

const Appetta = () => {
    let [searchParams] = useSearchParams();
    const [show, setShow] = useState(false);

    useEffect(() => {
        let paramSound = searchParams.get('sound');
        let sound = sounds.find(item => paramSound === item.title.toLowerCase());
        let special = specials.find(item => paramSound === item.title.toLowerCase());
        if (sound || special) {
            window.open(sound ? sound.url : special.url)
        }
    }, [])

    const onCopy = () => {
        navigator.clipboard.writeText(window.location);
        setShow(true);
    };

    return (
        <Container fluid className="h-100 appetta__container">
            <Row>
                <Col>
                    <div className="text-center text-danger display-1"><GiWinterHat /></div>
                    <h1 className="text-center">Appetta</h1>
                    <h5 className="text-center">A Christmas gift for Sergio</h5>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    {sounds.map((item, index) => <AudioButton key={item.title} item={{...item, index}}/>)}
                </Col>
            </Row>
            <Row className="mt-5">
                <h6 className="text-center">Bonus</h6>
            </Row>
            <Row className="mt-1">
                <Col>
                    {specials.map((item, index) => <AudioButton key={item.title} item={{...item, index}}/>)}
                </Col>
            </Row>

            <Button onClick={onCopy}>
                Copy url
            </Button>

            <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                Link copiato correttamente! Vai condividilo!< br/>
                (Please, Sergio, don't)
            </Toast>
        </Container>
    )
}

export default Appetta
