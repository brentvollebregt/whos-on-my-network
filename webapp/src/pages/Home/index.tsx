import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Home: React.FunctionComponent = () => {
    return <Container>
        <Row className="justify-content-md-center">
            <Col className="col-md-10 col-lg-8">
                <h1 className="text-center">Home: Temporary</h1>
            </Col>
        </Row>
    </Container>;
};

export default Home;
