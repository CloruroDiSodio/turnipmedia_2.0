import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import { GiWinterHat } from "react-icons/gi";
import AudioButton from "../../atoms/AudioButton/AudioButton";
import {sounds, specials} from "./sounds";
import './appetta.scss'

const Appetta = () => {
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
                    {sounds.map((item, index) => <AudioButton item={{...item, index}}/>)}
                </Col>
            </Row>
            <Row className="mt-5">
                <h6 className="text-center">Bonus</h6>
            </Row>
            <Row className="mt-1">
                <Col>
                    {specials.map((item, index) => <AudioButton item={{...item, index}}/>)}
                </Col>
            </Row>
        </Container>
    )
}

export default Appetta
