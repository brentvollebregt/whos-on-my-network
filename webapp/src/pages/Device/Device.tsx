import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTitle } from "hookrouter";
import Constants from "../../constants";

interface DeviceProps {
  id: number;
}

const Device: React.FunctionComponent<DeviceProps> = ({ id }) => {
  useTitle(`Device - ${Constants.title}`);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-md-10 col-lg-8">
          <h1 className="text-center">Device ({id}): Temporary</h1>
          <div style={{ background: "grey" }}>
            Device information, linked to
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Device;
