import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const People: React.FunctionComponent = () => {
    return <Container>
        <Row className="justify-content-md-center">
            <Col className="col-md-10 col-lg-8">
                <h1 className="text-center">People: Temporary</h1>
                <div style={{ background: 'grey' }}>Add person + filter</div>
                <div style={{ background: 'lightgrey', height: 200 }}>Table of people</div>
            </Col>
        </Row>
    </Container>;
};

export default People;
