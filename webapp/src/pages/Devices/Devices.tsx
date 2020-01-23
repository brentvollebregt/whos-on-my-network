import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTitle } from 'hookrouter';
import Constants from '../../constants';

const Devices: React.FunctionComponent = () => {
    useTitle(`Devices - ${Constants.title}`);
    
    return <Container>
        <Row className="justify-content-md-center">
            <Col className="col-md-10 col-lg-8">
                <h1 className="text-center">Devices: Temporary</h1>
                <div style={{ background: 'lightgrey', height: 200 }}>Device table - click to view device</div>
            </Col>
        </Row>
    </Container>;
};

export default Devices;
