import { Container, Row, Col } from "react-bootstrap";
import { FaBook, FaCheck, FaLayerGroup } from "react-icons/fa";
import books from "./books.json";
import LibraryTable from "../../atoms/LibraryTable/LibraryTable";

/* 
TODO:
    - style
    - search
*/
const Library = () => {
    const realBooks = books.filter(book => book.Titolo);

    return (
    <Container>
        <Row className="justify-content-center mt-5 mb-5">
            <Col xs="auto">
                <h2 className="text-center"><FaBook /> My Library</h2>
            </Col>
        </Row>
        <Row className="justify-content-center mt-5 mb-5">
            <Col xs="auto">
                <h4 className="text-center d-inline"><FaLayerGroup /> <b>Total: </b>{realBooks.length}</h4>
            </Col>
            <Col xs="auto">
                <h4 className="text-center d-inline"><FaCheck /> <b>Read: </b>{realBooks.filter(book => book.Letto === "TRUE").length}</h4>
            </Col>
        </Row>
        <LibraryTable />
    </Container>
    );
};

export default Library;