"use client";

import {Col, Container, Row} from "react-bootstrap";
import { GiWinterHat } from "react-icons/gi";
import AudioButton from "../../atoms/AudioButton/AudioButton";
import {sounds, specials} from "./sounds";
import './appetta.scss'

const Appetta = () => {
    return (
        <Container as="main" fluid className="h-100 appetta__container">
            <Row>
                <Col>
                    <div className="text-center text-danger display-1"><GiWinterHat aria-hidden="true" /></div>
                    <h1 className="text-center">Appetta</h1>
                    <p className="text-center h5">A Christmas gift for Sergio</p>
                </Col>
            </Row>
            <Row className="mt-3">
                <h2 className="visually-hidden">Sounds</h2>
                {/* The sound titles are Italian. */}
                <Col lang="it">
                    {sounds.map((item, index) => <AudioButton key={item.title} item={{...item, index}}/>)}
                </Col>
            </Row>
            <Row className="mt-5">
                <h2 className="text-center h6">Bonus</h2>
            </Row>
            <Row className="mt-1">
                <Col lang="it">
                    {specials.map((item, index) => <AudioButton key={item.title} item={{...item, index}}/>)}
                </Col>
            </Row>
        </Container>
    )
}

export default Appetta