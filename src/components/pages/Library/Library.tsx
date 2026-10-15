"use client";

import { Container, Row, Col } from "react-bootstrap";
import { FaBook, FaCheck, FaLayerGroup } from "react-icons/fa";
import books from "./books.json";
import type { Book } from "./book";
import LibraryTable from "../../atoms/LibraryTable/LibraryTable";

/* 
TODO:
    - style
    - search
*/
const Library = () => {
    const realBooks: Book[] = books.filter(book => book.Titolo);

    return (
    <Container as="main">
        <Row className="justify-content-center mt-5 mb-5">
            <Col xs="auto">
                <h1 className="text-center h2"><FaBook aria-hidden="true" /> My Library</h1>
            </Col>
        </Row>
        <Row className="justify-content-center mt-5 mb-5">
            <Col xs="auto">
                <p className="text-center d-inline h4"><FaLayerGroup aria-hidden="true" /> <b>Total: </b>{realBooks.length}</p>
            </Col>
            <Col xs="auto">
                <p className="text-center d-inline h4"><FaCheck aria-hidden="true" /> <b>Read: </b>{realBooks.filter(book => book.Letto === "TRUE").length}</p>
            </Col>
        </Row>
        <LibraryTable />
    </Container>
    );
};

export default Library;