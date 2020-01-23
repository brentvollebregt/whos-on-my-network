import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Constants from '../../constants';
import { useTitle } from 'hookrouter';

const Scans: React.FunctionComponent = () => {
    useTitle(`Scans - ${Constants.title}`);

    return <Container>
        <Row className="justify-content-md-center">
            <Col className="col-md-10 col-lg-8">
                <h1 className="text-center">Scans: Temporary</h1>
                <div style={{ background: 'lightgrey', height: 200 }}>Scan table - click to view scan</div>
            </Col>
        </Row>
    </Container>;
};

export default Scans;
