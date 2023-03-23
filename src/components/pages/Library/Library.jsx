import { Container, Row, Col, Table, Form } from "react-bootstrap";
import { FaBook, FaCheck, FaLayerGroup } from "react-icons/fa";
import books from "./books.json";

/* 
TODO:
    - style
    - search
    - sort
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
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publishing House</th>
                <th>Read</th>
                </tr>
            </thead>
            <tbody>
                {realBooks.map((book, index) => (
                    <tr key={`book-${index}`}>
                        <td>{index}</td>
                        <td>{book.Titolo}</td>
                        <td>{book.Autore}</td>
                        <td>{book["Casa editrice"]}</td>
                        <td>{book.Letto === "TRUE" ? <FaCheck />: ""}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </Container>
    );
};

export default Library;