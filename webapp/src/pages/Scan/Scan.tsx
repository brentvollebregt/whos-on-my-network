import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Constants from "../../constants";
import { useTitle } from "hookrouter";

interface ScanProps {
  id: number;
}

const Scan: React.FunctionComponent<ScanProps> = ({ id }) => {
  useTitle(`Scans - ${Constants.title}`);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-md-10 col-lg-8">
          <h1 className="text-center">Scan ({id}): Temporary</h1>
          <div style={{ background: "lightgrey" }}>Scan details</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Scan;
