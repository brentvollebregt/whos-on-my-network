import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Home: React.FunctionComponent = () => {
    return <Container>
        <Row className="justify-content-md-center">
            <Col className="col-md-10 col-lg-8">
                <h1 className="text-center">Home: Temporary</h1>
                <div style={{ background: 'grey', textAlign: 'left' }}>Date range selection buttons: 1 day, 1 week, 1 month</div>
                <div style={{ background: 'lightgrey', marginTop: 10, height: 200 }}>Some sort of chart showing device discoveries</div>
            </Col>
        </Row>
    </Container>;
};

export default Home;
